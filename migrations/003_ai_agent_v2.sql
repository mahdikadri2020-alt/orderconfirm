-- ============================================================
-- OrderConfirm DZ — AI Agent v2 Schema
-- Tables: ai_settings, ai_logs
-- Extends: orders with delivery fields
-- Compatible with existing 001_schema.sql + 002_ai_schema.sql
-- ============================================================

-- 0. Ensure extensions
create extension if not exists "pgcrypto";

-- ============================================================
-- 1. ai_settings — Per-merchant AI configuration
--    Each merchant has fully independent AI settings.
--    Never shared across stores.
-- ============================================================
create table if not exists ai_settings (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references stores(id) on delete cascade,
  enabled boolean not null default false,
  model text not null default 'gpt-4o-mini',
  temperature numeric(3,2) not null default 0.7
    check (temperature >= 0 and temperature <= 2),
  system_prompt text,
  language text not null default 'dz'
    check (language in ('dz', 'ar', 'fr', 'en')),
  handoff_message text default 'Un agent va vous contacter sous peu. Merci pour votre patience.',
  fallback_message text default 'Désolé, je n''ai pas compris. Pouvez-vous reformuler s''il vous plaît ?',
  max_messages integer not null default 20,
  min_confidence numeric(3,2) not null default 0.65
    check (min_confidence >= 0 and min_confidence <= 1),
  working_hours_start time default '09:00',
  working_hours_end time default '18:00',
  working_days text[] default '{1,2,3,4,5,6}'::text[],
  timezone text default 'Africa/Algiers',
  updated_at timestamptz not null default now(),

  unique(store_id)
);

create index if not exists idx_ai_settings_store on ai_settings(store_id);

drop trigger if exists trg_ai_settings_updated_at on ai_settings;
create trigger trg_ai_settings_updated_at
  before update on ai_settings
  for each row execute function trigger_set_updated_at();

-- ============================================================
-- 2. ai_conversations — Per-order conversation messages
--    Stores each message in the AI conversation.
--    Max 20 messages per order (enforced by app, not DB).
-- ============================================================
create table if not exists ai_conversations (
  id bigserial primary key,
  store_id uuid not null references stores(id) on delete cascade,
  order_id uuid,
  phone text not null,
  role text not null check (role in ('customer', 'assistant', 'system')),
  message text not null,
  tokens integer default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_ai_conv_lookup on ai_conversations(store_id, phone, created_at desc);
create index if not exists idx_ai_conv_order on ai_conversations(order_id);
create index if not exists idx_ai_conv_created on ai_conversations(created_at);

-- ============================================================
-- 3. ai_logs — AI interaction analytics
--    Tracks intent, confidence, latency for every AI reply.
-- ============================================================
create table if not exists ai_logs (
  id bigserial primary key,
  store_id uuid not null references stores(id) on delete cascade,
  order_id uuid,
  phone text,
  intent text not null,
  confidence numeric(3,2),
  latency_ms integer default 0,
  model text,
  tokens_used integer default 0,
  customer_message text,
  ai_reply text,
  escalated boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_ai_logs_store on ai_logs(store_id);
create index if not exists idx_ai_logs_intent on ai_logs(intent);
create index if not exists idx_ai_logs_created on ai_logs(created_at desc);
create index if not exists idx_ai_logs_order on ai_logs(order_id);

-- ============================================================
-- 4. Ensure orders table has delivery fields
--    The user's orders table already has most fields.
--    These ALTERs are safe to run even if columns exist.
-- ============================================================
alter table orders
  add column if not exists wilaya text,
  add column if not exists commune text,
  add column if not exists notes text;

-- ============================================================
-- 5. RPC: Get AI conversation history for a phone number
-- ============================================================
create or replace function get_ai_conversation(
  p_store_id uuid,
  p_phone text,
  p_limit int default 20
) returns jsonb as $$
declare
  v_messages jsonb;
begin
  select coalesce(jsonb_agg(
    jsonb_build_object(
      'role', role,
      'message', message,
      'tokens', tokens,
      'created_at', created_at
    ) order by created_at asc
  ), '[]'::jsonb) into v_messages
  from (
    select role, message, tokens, created_at
    from ai_conversations
    where store_id = p_store_id and phone = p_phone
    order by created_at desc
    limit p_limit
  ) sub;
  return v_messages;
end;
$$ language plpgsql;

-- ============================================================
-- 6. RPC: Log an AI interaction
-- ============================================================
create or replace function log_ai_interaction(
  p_store_id uuid,
  p_order_id uuid,
  p_phone text,
  p_intent text,
  p_confidence numeric,
  p_latency_ms integer,
  p_model text,
  p_tokens_used integer,
  p_customer_message text,
  p_ai_reply text,
  p_escalated boolean default false
) returns bigint as $$
declare
  v_id bigint;
begin
  insert into ai_logs (
    store_id, order_id, phone,
    intent, confidence, latency_ms, model,
    tokens_used, customer_message, ai_reply, escalated
  ) values (
    p_store_id, p_order_id, p_phone,
    p_intent, p_confidence, p_latency_ms, p_model,
    p_tokens_used, p_customer_message, p_ai_reply, p_escalated
  )
  returning id into v_id;
  return v_id;
end;
$$ language plpgsql;

-- ============================================================
-- 7. RPC: Get or create AI settings for a store
--    Returns default settings if none exist.
-- ============================================================
create or replace function get_ai_settings(
  p_store_id uuid
) returns jsonb as $$
declare
  v_settings jsonb;
begin
  select row_to_json(ai_settings)::jsonb into v_settings
  from ai_settings
  where store_id = p_store_id;
  if not found then
    insert into ai_settings (store_id) values (p_store_id);
    select row_to_json(ai_settings)::jsonb into v_settings
    from ai_settings
    where store_id = p_store_id;
  end if;
  return v_settings;
end;
$$ language plpgsql;

-- ============================================================
-- 8. RPC: Save AI conversation message
-- ============================================================
create or replace function save_ai_message(
  p_store_id uuid,
  p_order_id uuid,
  p_phone text,
  p_role text,
  p_message text,
  p_tokens integer default 0
) returns bigint as $$
declare
  v_id bigint;
begin
  insert into ai_conversations (store_id, order_id, phone, role, message, tokens)
  values (p_store_id, p_order_id, p_phone, p_role, p_message, p_tokens)
  returning id into v_id;
  return v_id;
end;
$$ language plpgsql;

-- ============================================================
-- 9. RPC: Insert order activity
-- ============================================================
create or replace function insert_order_activity(
  p_order_id uuid,
  p_activity_type text,
  p_description text
) returns uuid as $$
declare
  v_id uuid;
begin
  insert into order_activities (order_id, activity_type, description)
  values (p_order_id, p_activity_type, p_description)
  returning id into v_id;
  return v_id;
end;
$$ language plpgsql;

-- ============================================================
-- 10. RPC: Insert merchant notification
-- ============================================================
create or replace function insert_notification(
  p_store_id uuid,
  p_type text,
  p_title text,
  p_message text,
  p_data jsonb default '{}'::jsonb
) returns bigint as $$
declare
  v_id bigint;
begin
  insert into notification_queue (store_id, type, title, message, data)
  values (p_store_id, p_type, p_title, p_message, p_data)
  returning id into v_id;
  return v_id;
end;
$$ language plpgsql;

-- ============================================================
-- 11. Cleanup old AI data (schedule via pg_cron)
-- ============================================================
create or replace function cleanup_ai_data_v2()
returns void as $$
begin
  delete from ai_conversations where created_at < now() - interval '90 days';
  delete from ai_logs where created_at < now() - interval '90 days';
  delete from ai_settings where updated_at < now() - interval '365 days' and enabled = false;
end;
$$ language plpgsql;
