-- ============================================================
-- OrderConfirm SaaS — Complete Database Schema
-- v1.0.0
-- ============================================================

-- 0. Extensions
create extension if not exists "pgcrypto";
create extension if not exists "pg_stat_statements";

-- ============================================================
-- 1. STORES (merchant/tenant configuration)
-- ============================================================
create table if not exists stores (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text unique,

  -- WhatsApp provider
  whatsapp_provider    text not null default 'meta'
                      check (whatsapp_provider in ('meta','ultramsg','greenapi','evolution')),

  -- Meta / Provider credentials
  phone_number_id      text,
  access_token         text,   -- encrypted at application level / vault
  business_account_id  text,
  webhook_secret       text,

  -- Messaging defaults
  template_name  text default 'order_confirmation',
  language       text default 'fr',
  rate_limit_per_minute integer not null default 100,

  -- Channel routing (future: telegram, messenger, email, sms)
  channels       jsonb default '{"whatsapp": true}'::jsonb,

  -- Admin controls
  active             boolean not null default true,
  maintenance_mode   boolean not null default false,
  sending_paused     boolean not null default false,
  paused_at          timestamptz,
  paused_reason      text,

  -- Metadata
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Index for lookups
create index idx_stores_slug on stores(slug);
create index idx_stores_active on stores(active) where active = true;

-- Auto-update updated_at
create or replace function trigger_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_stores_updated_at
  before update on stores
  for each row execute function trigger_set_updated_at();

-- ============================================================
-- 2. MESSAGE TEMPLATES
-- ============================================================
create table if not exists message_templates (
  id            uuid primary key default gen_random_uuid(),
  store_id      uuid not null references stores(id) on delete cascade,
  name          text not null,
  language      text not null default 'fr',
  message_type  text not null default 'text'
                check (message_type in ('text','template','interactive','list','image','document','audio','video','location','contacts')),
  content       jsonb not null,   -- flexible: text, interactive buttons, list, media, etc.
  variables     text[] default '{}',  -- e.g. {customer_name, product, amount}
  active        boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index idx_msg_templates_store on message_templates(store_id);
create index idx_msg_templates_name on message_templates(store_id, name, language);
create trigger trg_msg_templates_updated_at
  before update on message_templates
  for each row execute function trigger_set_updated_at();

-- ============================================================
-- 3. ORDERS (orders coming from the merchant's Next.js app)
-- ============================================================
create table if not exists orders (
  order_id       uuid primary key,
  store_id       uuid not null references stores(id),
  customer_name  text not null,
  phone          text not null,
  product        text,
  amount         numeric,
  currency       text default 'DA',
  language       text default 'fr',
  store_name     text,
  message_type   text default 'interactive',

  -- Status lifecycle: pending → sent → delivered → read → confirmed/cancelled
  status                text not null default 'pending'
                        check (status in ('pending','queued','sent','delivered','read','confirmed','cancelled','failed','duplicate')),
  provider              text,
  provider_message_id   text,
  sent_at               timestamptz,
  delivered_at          timestamptz,
  read_at               timestamptz,
  confirmation_time     timestamptz,
  error_message         text,
  retry_count           integer not null default 0,

  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_orders_store on orders(store_id);
create index idx_orders_phone on orders(phone);
create index idx_orders_status on orders(status);
create index idx_orders_provider_msg on orders(provider_message_id);
create index idx_orders_created on orders(created_at desc);
create trigger trg_orders_updated_at
  before update on orders
  for each row execute function trigger_set_updated_at();

-- ============================================================
-- 4. MESSAGE QUEUE (async processing, retries, dedup)
-- ============================================================
create table if not exists message_queue (
  id                bigserial primary key,
  store_id          uuid not null references stores(id),
  order_id          uuid references orders(order_id),
  phone             text not null,
  message_type      text not null default 'interactive',
  payload           jsonb,           -- complete provider payload
  template_id       uuid references message_templates(id),
  variables         jsonb,           -- resolved variables for logging

  -- Deduplication
  message_hash      text,            -- sha256(order_id + template + phone + body)

  -- Status
  status            text not null default 'pending'
                    check (status in ('pending','processing','sent','failed','duplicate','cancelled')),
  priority          integer not null default 0,

  -- Locking (prevents concurrent processing)
  locked_at         timestamptz,
  locked_by         text,
  lock_token        uuid,

  -- Retry
  retry_count       integer not null default 0,
  max_retries       integer not null default 5,
  next_retry_at     timestamptz,
  last_error        text,

  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create unique index idx_queue_message_hash on message_queue(message_hash) where status = 'pending';
create index idx_queue_pending on message_queue(status, next_retry_at)
  where status = 'pending' and (next_retry_at is null or next_retry_at <= now());
create index idx_queue_processing on message_queue(locked_at) where status = 'processing';
create trigger trg_queue_updated_at
  before update on message_queue
  for each row execute function trigger_set_updated_at();

-- Lock function: atomically claim next pending message
create or replace function claim_next_message(p_lock_minutes int default 2)
returns bigint as $$
declare
  v_id bigint;
  v_token uuid := gen_random_uuid();
begin
  update message_queue
    set status = 'processing',
        locked_at = now(),
        locked_by = pg_backend_pid()::text,
        lock_token = v_token
  where id = (
    select id from message_queue
    where status = 'pending'
      and (next_retry_at is null or next_retry_at <= now())
    order by priority desc, created_at asc
    limit 1
    for update skip locked
  )
  returning id into v_id;
  return v_id;
end;
$$ language plpgsql;

-- ============================================================
-- 5. MESSAGE LOGS (complete audit trail)
-- ============================================================
create table if not exists message_logs (
  id                bigserial primary key,
  queue_id          bigint references message_queue(id),
  store_id          uuid not null references stores(id),
  order_id          uuid references orders(order_id),
  phone             text not null,
  provider          text,
  message_type      text,
  template_name     text,
  variables         jsonb,

  -- Full payload/response for debugging
  payload           jsonb,
  response          jsonb,
  provider_message_id text,

  -- Status
  status            text not null default 'pending'
                    check (status in ('pending','sent','delivered','read','failed','processing')),
  error_message     text,
  error_code        text,
  execution_time_ms integer,

  -- Retry tracking
  attempt_number    integer not null default 1,
  parent_log_id     bigint references message_logs(id),  -- links retry attempts

  created_at  timestamptz not null default now()
);

create index idx_msg_logs_store on message_logs(store_id);
create index idx_msg_logs_order on message_logs(order_id);
create index idx_msg_logs_provider_msg on message_logs(provider_message_id);
create index idx_msg_logs_created on message_logs(created_at desc);
create index idx_msg_logs_status on message_logs(status);

-- ============================================================
-- 6. MESSAGE STATUS (delivery/read webhook events)
-- ============================================================
create table if not exists message_status (
  id                  bigserial primary key,
  provider_message_id text not null,
  log_id              bigint references message_logs(id),
  store_id            uuid references stores(id),
  status              text not null check (status in ('delivered','read','failed')),
  error_message       text,
  recipient_id        text,
  timestamp           timestamptz,
  raw_payload         jsonb,
  created_at          timestamptz not null default now()
);

create index idx_msg_status_provider on message_status(provider_message_id);
create index idx_msg_status_log on message_status(log_id);

-- ============================================================
-- 7. RATE LIMITING (per-store minute buckets)
-- ============================================================
create table if not exists rate_limits (
  id            bigserial primary key,
  store_id      uuid not null references stores(id),
  bucket_minute timestamptz not null,
  count         integer not null default 0,
  created_at    timestamptz not null default now(),

  unique(store_id, bucket_minute)
);

create index idx_rate_limits_lookup on rate_limits(store_id, bucket_minute);

-- Increment and check rate limit
create or replace function check_rate_limit(
  p_store_id        uuid,
  p_max_per_minute  int default 100
) returns jsonb as $$
declare
  v_bucket timestamptz := date_trunc('minute', now());
  v_count  int;
begin
  insert into rate_limits (store_id, bucket_minute, count)
    values (p_store_id, v_bucket, 1)
    on conflict (store_id, bucket_minute)
    do update set count = rate_limits.count + 1
    returning count into v_count;

  return jsonb_build_object(
    'allowed', v_count <= p_max_per_minute,
    'remaining', greatest(0, p_max_per_minute - v_count),
    'reset_at', v_bucket + interval '1 minute'
  );
end;
$$ language plpgsql;

-- Cleanup old rate limit data (>24h)
create or replace function cleanup_rate_limits()
returns void as $$
begin
  delete from rate_limits where bucket_minute < now() - interval '24 hours';
end;
$$ language plpgsql;

-- ============================================================
-- 8. METRICS CACHE (pre-computed dashboard metrics)
-- ============================================================
create table if not exists metrics_cache (
  store_id            uuid primary key references stores(id),
  messages_sent       integer not null default 0,
  messages_delivered  integer not null default 0,
  messages_read       integer not null default 0,
  messages_failed     integer not null default 0,
  messages_pending    integer not null default 0,
  orders_confirmed    integer not null default 0,
  orders_cancelled    integer not null default 0,
  avg_response_time_ms integer not null default 0,
  delivery_rate       numeric(5,2) not null default 0,
  read_rate           numeric(5,2) not null default 0,
  confirmation_rate   numeric(5,2) not null default 0,
  updated_at          timestamptz not null default now()
);

-- Refresh metrics (call via pg_cron or n8n schedule)
create or replace function refresh_metrics(p_store_id uuid default null)
returns void as $$
begin
  with stats as (
    select
      coalesce(sum(case when status = 'sent' then 1 else 0 end), 0) as sent,
      coalesce(sum(case when status = 'delivered' then 1 else 0 end), 0) as delivered,
      coalesce(sum(case when status = 'read' then 1 else 0 end), 0) as read,
      coalesce(sum(case when status = 'failed' then 1 else 0 end), 0) as failed,
      coalesce(sum(case when status = 'pending' then 1 else 0 end), 0) as pending,
      coalesce(sum(case when status = 'confirmed' then 1 else 0 end), 0) as confirmed,
      coalesce(sum(case when status = 'cancelled' then 1 else 0 end), 0) as cancelled,
      coalesce(avg(
        case when confirmation_time is not null and sent_at is not null
        then extract(epoch from (confirmation_time - sent_at)) * 1000
        end
      ), 0)::integer as avg_resp
    from orders
    where (p_store_id is null or store_id = p_store_id)
      and created_at > now() - interval '30 days'
  )
  insert into metrics_cache (store_id, messages_sent, messages_delivered, messages_read,
    messages_failed, messages_pending, orders_confirmed, orders_cancelled,
    avg_response_time_ms,
    delivery_rate,
    read_rate,
    confirmation_rate,
    updated_at)
  select
    coalesce(p_store_id, '00000000-0000-0000-0000-000000000000'),
    sent, delivered, read, failed, pending, confirmed, cancelled,
    avg_resp,
    case when sent > 0 then round((delivered::numeric / sent) * 100, 2) else 0 end,
    case when delivered > 0 then round((read::numeric / delivered) * 100, 2) else 0 end,
    case when sent > 0 then round(((confirmed + cancelled)::numeric / sent) * 100, 2) else 0 end,
    now()
  on conflict (store_id) do update set
    messages_sent = excluded.messages_sent,
    messages_delivered = excluded.messages_delivered,
    messages_read = excluded.messages_read,
    messages_failed = excluded.messages_failed,
    messages_pending = excluded.messages_pending,
    orders_confirmed = excluded.orders_confirmed,
    orders_cancelled = excluded.orders_cancelled,
    avg_response_time_ms = excluded.avg_response_time_ms,
    delivery_rate = excluded.delivery_rate,
    read_rate = excluded.read_rate,
    confirmation_rate = excluded.confirmation_rate,
    updated_at = excluded.updated_at;
end;
$$ language plpgsql;

-- ============================================================
-- 9. HEALTH CHECK VIEW
-- ============================================================
create or replace view v_health as
select
  'database' as component,
  'healthy' as status,
  now() as server_time,
  (select count(*) from pg_stat_activity) as connections,
  (select count(*) from stores where active = true) as active_stores,
  (select count(*) from message_queue where status = 'pending'
    and (next_retry_at is null or next_retry_at <= now())) as queue_depth,
  (select extract(epoch from (now() - min(created_at)))::int
   from message_logs) as uptime_seconds;

-- ============================================================
-- 10. SEED: Default templates
-- ============================================================
-- These are inserted per-store when a new store is created.
-- The application inserts them via the store creation flow.
-- Example template for order_confirmation:

-- insert into message_templates (store_id, name, language, message_type, content, variables)
-- values (
--   'STORE_UUID',
--   'order_confirmation',
--   'fr',
--   'interactive',
--   '{
--     "body": "Bonjour {{customer_name}}\n\nVotre commande est prête.\n\n📦 Produit : {{product}}\n💰 Montant : {{amount}} {{currency}}\n\nVeuillez confirmer votre commande.",
--     "buttons": [
--       {"id": "CONFIRM_ORDER|{{order_id}}", "title": "✅ Confirm Order"},
--       {"id": "CANCEL_ORDER|{{order_id}}", "title": "❌ Cancel Order"}
--     ]
--   }'::jsonb,
--   '{customer_name, product, amount, currency, order_id}'
-- );
