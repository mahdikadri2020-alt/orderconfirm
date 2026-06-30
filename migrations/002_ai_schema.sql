-- ============================================================
-- OrderConfirm SaaS — AI Agent Schema
-- v2.0.0
-- ============================================================

-- 0. Extensions
-- pgcrypto should already exist from 001_schema.sql

-- ============================================================
-- 1. EXTEND STORES TABLE with AI configuration
-- ============================================================
alter table stores
  add column if not exists ai_enabled boolean not null default false,
  add column if not exists ai_provider text not null default 'openai'
    check (ai_provider in ('openai','claude','gemini')),
  add column if not exists ai_model text default 'gpt-4o-mini',
  add column if not exists ai_temperature numeric(3,2) default 0.7,
  add column if not exists ai_max_tokens integer default 1024,
  add column if not exists ai_system_prompt text,
  add column if not exists ai_language text default 'fr'
    check (ai_language in ('fr','ar','en')),
  add column if not exists business_hours jsonb default '{"monday":{"open":"09:00","close":"18:00"},"tuesday":{"open":"09:00","close":"18:00"},"wednesday":{"open":"09:00","close":"18:00"},"thursday":{"open":"09:00","close":"18:00"},"friday":{"open":"09:00","close":"17:00"},"saturday":{"open":"09:00","close":"14:00"},"sunday":{"open":null,"close":null}}'::jsonb,
  add column if not exists timezone text default 'Africa/Algiers',
  add column if not exists delivery_policy jsonb default '{"delivery_fee":"500 DA","free_delivery_min":"5000 DA","estimated_delivery":"24-48h","return_policy":"Returns accepted within 7 days. Item must be unused in original packaging.","payment_methods":["Cash on delivery","Edahabia","CCP","Baridimob"],"wilayas":["Alger","Oran","Constantine","Blida","Setif","Annaba","Tlemcen","Bejaia","Biskra","Batna","Boumerdes","Chlef","Medea","Mostaganem","Sidi Bel Abbes","Tiaret","Tebessa","Bordj Bou Arreridj","Ain Defla","El Oued","Djelfa","Saida","Relizane","Ghardaia","Ouargla","Tipaza","Bouira"]}'::jsonb,
  add column if not exists faq jsonb default '[]'::jsonb,
  add column if not exists welcome_message text,
  add column if not exists auto_reply_enabled boolean not null default false;

-- ============================================================
-- 2. CUSTOMERS TABLE
-- ============================================================
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references stores(id) on delete cascade,
  phone text not null,
  name text,
  language text default 'fr',
  preferred_language text default 'fr',
  total_orders integer not null default 0,
  total_spent numeric(10,2) default 0,
  last_order_at timestamptz,
  first_seen_at timestamptz not null default now(),
  tags text[] default '{}',
  notes text,
  metadata jsonb default '{}'::jsonb,
  blacklisted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique(store_id, phone)
);

create index if not exists idx_customers_store on customers(store_id);
create index if not exists idx_customers_phone on customers(phone);
create index if not exists idx_customers_store_phone on customers(store_id, phone);

drop trigger if exists trg_customers_updated_at on customers;
create trigger trg_customers_updated_at
  before update on customers
  for each row execute function trigger_set_updated_at();

-- ============================================================
-- 3. CUSTOMER PREFERENCES
-- ============================================================
create table if not exists customer_preferences (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references customers(id) on delete cascade,
  store_id uuid not null references stores(id) on delete cascade,
  preferred_language text default 'fr',
  notification_enabled boolean not null default true,
  preferred_contact_time jsonb,
  notes text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique(customer_id, store_id)
);

create index if not exists idx_cust_prefs_customer on customer_preferences(customer_id);
create index if not exists idx_cust_prefs_store on customer_preferences(store_id);

drop trigger if exists trg_cust_prefs_updated_at on customer_preferences;
create trigger trg_cust_prefs_updated_at
  before update on customer_preferences
  for each row execute function trigger_set_updated_at();

-- ============================================================
-- 4. AI CONVERSATIONS
-- ============================================================
create table if not exists ai_conversations (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references stores(id) on delete cascade,
  customer_id uuid references customers(id),
  order_id uuid references orders(order_id),
  phone text not null,
  status text not null default 'active'
    check (status in ('active','resolved','escalated','expired')),
  trigger_type text not null
    check (trigger_type in ('status_change','text_message','voice_message','image_message','button_reply')),
  language text default 'fr',
  ai_provider text,
  ai_model text,
  ai_temperature numeric(3,2),
  message_count integer not null default 0,
  token_count integer not null default 0,
  total_cost numeric(10,6) not null default 0,
  sentiment text,
  needs_human boolean not null default false,
  escalated_at timestamptz,
  escalated_reason text,
  handoff_count integer not null default 0,
  started_at timestamptz not null default now(),
  last_message_at timestamptz not null default now(),
  resolved_at timestamptz,
  duration_seconds integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_ai_conv_store on ai_conversations(store_id);
create index if not exists idx_ai_conv_customer on ai_conversations(customer_id);
create index if not exists idx_ai_conv_order on ai_conversations(order_id);
create index if not exists idx_ai_conv_phone on ai_conversations(phone);
create index if not exists idx_ai_conv_status on ai_conversations(status);
create index if not exists idx_ai_conv_active on ai_conversations(store_id, status) where status = 'active';

drop trigger if exists trg_ai_conv_updated_at on ai_conversations;
create trigger trg_ai_conv_updated_at
  before update on ai_conversations
  for each row execute function trigger_set_updated_at();

-- ============================================================
-- 5. AI MEMORY (long-term customer memory)
-- ============================================================
create table if not exists ai_memory (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references stores(id) on delete cascade,
  customer_id uuid not null references customers(id),
  conversation_id uuid references ai_conversations(id),
  phone text not null,
  memory_type text not null
    check (memory_type in ('fact','preference','interaction','order_history','issue','note')),
  key text not null,
  value text not null,
  confidence numeric(3,2) default 1.0,
  context jsonb default '{}'::jsonb,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique(store_id, customer_id, key)
);

create index if not exists idx_ai_memory_store on ai_memory(store_id);
create index if not exists idx_ai_memory_customer on ai_memory(customer_id);
create index if not exists idx_ai_memory_type on ai_memory(memory_type);

drop trigger if exists trg_ai_memory_updated_at on ai_memory;
create trigger trg_ai_memory_updated_at
  before update on ai_memory
  for each row execute function trigger_set_updated_at();

-- ============================================================
-- 6. CONVERSATION STATE
-- ============================================================
create table if not exists conversation_state (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references ai_conversations(id) on delete cascade,
  store_id uuid not null references stores(id) on delete cascade,
  customer_id uuid references customers(id),
  phone text not null,
  current_state text not null default 'greeting',
  previous_state text,
  state_data jsonb default '{}'::jsonb,
  pending_action text,
  pending_action_data jsonb,
  awaiting_input boolean not null default false,
  expected_input_type text,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  unique(conversation_id)
);

create index if not exists idx_conv_state_conv on conversation_state(conversation_id);
create index if not exists idx_conv_state_customer on conversation_state(customer_id);

drop trigger if exists trg_conv_state_updated_at on conversation_state;
create trigger trg_conv_state_updated_at
  before update on conversation_state
  for each row execute function trigger_set_updated_at();

-- ============================================================
-- 7. SUPPORT TICKETS
-- ============================================================
create table if not exists support_tickets (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references stores(id) on delete cascade,
  customer_id uuid references customers(id),
  order_id uuid references orders(order_id),
  conversation_id uuid references ai_conversations(id),
  phone text not null,
  subject text not null,
  description text,
  category text not null
    check (category in ('order_issue','delivery','payment','product','complaint','refund','other')),
  priority text not null default 'normal'
    check (priority in ('low','normal','high','urgent')),
  status text not null default 'open'
    check (status in ('open','in_progress','resolved','closed')),
  assigned_to text,
  resolved_at timestamptz,
  resolution_notes text,
  source text default 'ai_escalation',
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_tickets_store on support_tickets(store_id);
create index if not exists idx_tickets_status on support_tickets(status);
create index if not exists idx_tickets_priority on support_tickets(priority);
create index if not exists idx_tickets_customer on support_tickets(customer_id);

drop trigger if exists trg_tickets_updated_at on support_tickets;
create trigger trg_tickets_updated_at
  before update on support_tickets
  for each row execute function trigger_set_updated_at();

-- ============================================================
-- 8. AI ANALYTICS (per-interaction tracking)
-- ============================================================
create table if not exists ai_analytics (
  id bigserial primary key,
  store_id uuid not null references stores(id) on delete cascade,
  conversation_id uuid references ai_conversations(id),
  customer_id uuid references customers(id),
  order_id uuid references orders(order_id),
  request_text text,
  response_text text,
  response_time_ms integer not null default 0,
  prompt_tokens integer not null default 0,
  completion_tokens integer not null default 0,
  total_tokens integer not null default 0,
  cost_usd numeric(10,8) not null default 0,
  ai_provider text not null,
  ai_model text,
  temperature numeric(3,2),
  customer_sentiment text,
  sentiment_score numeric(3,2),
  resolved boolean not null default false,
  escalated boolean not null default false,
  handoff_count integer not null default 0,
  has_error boolean not null default false,
  error_message text,
  error_code text,
  created_at timestamptz not null default now()
);

create index if not exists idx_ai_analytics_store on ai_analytics(store_id);
create index if not exists idx_ai_analytics_conv on ai_analytics(conversation_id);
create index if not exists idx_ai_analytics_created on ai_analytics(created_at desc);
create index if not exists idx_ai_analytics_provider on ai_analytics(ai_provider);

-- ============================================================
-- 9. DEAD LETTER QUEUE
-- ============================================================
create table if not exists dead_letter_queue (
  id bigserial primary key,
  store_id uuid references stores(id),
  workflow_name text not null default 'ai-agent',
  node_name text,
  error_message text not null,
  error_code text,
  error_stack text,
  input_data jsonb,
  retry_count integer not null default 0,
  max_retries integer not null default 3,
  status text not null default 'pending'
    check (status in ('pending','processing','resolved','failed')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists idx_dlq_status on dead_letter_queue(status);
create index if not exists idx_dlq_created on dead_letter_queue(created_at desc);

-- ============================================================
-- 10. NOTIFICATION QUEUE
-- ============================================================
create table if not exists notification_queue (
  id bigserial primary key,
  store_id uuid not null references stores(id) on delete cascade,
  type text not null
    check (type in ('order_confirmed','order_cancelled','ai_escalated','address_changed','phone_changed','order_modified','support_ticket_created','new_customer_message')),
  title text not null,
  message text,
  data jsonb,
  channel text not null default 'whatsapp',
  status text not null default 'pending'
    check (status in ('pending','sent','failed')),
  created_at timestamptz not null default now(),
  sent_at timestamptz
);

create index if not exists idx_notif_queue_store on notification_queue(store_id);
create index if not exists idx_notif_queue_status on notification_queue(status);

-- ============================================================
-- 11. EXTEND ORDERS TABLE with AI fields
-- ============================================================
alter table orders
  add column if not exists needs_human boolean not null default false,
  add column if not exists ai_conversation_id uuid references ai_conversations(id),
  add column if not exists cancellation_reason text,
  add column if not exists delivery_address text,
  add column if not exists customer_phone_updated text,
  add column if not exists quantity_updated integer,
  add column if not exists ai_handled_at timestamptz,
  add column if not exists merchant_notified boolean not null default false;

-- ============================================================
-- 12. CONVERSATION HISTORY (extended with role tracking)
-- ============================================================
-- The existing message_logs table handles audit trail.
-- This table tracks the actual AI-customer conversation.
create table if not exists conversation_history (
  id bigserial primary key,
  store_id uuid not null references stores(id) on delete cascade,
  conversation_id uuid not null references ai_conversations(id) on delete cascade,
  customer_id uuid references customers(id),
  phone text not null,
  role text not null check (role in ('customer','ai','system')),
  message text not null,
  message_type text default 'text'
    check (message_type in ('text','interactive','button_reply','voice','image','document','location')),
  media_url text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_conv_hist_conv on conversation_history(conversation_id);
create index if not exists idx_conv_hist_store on conversation_history(store_id);
create index if not exists idx_conv_hist_phone on conversation_history(phone);
create index if not exists idx_conv_hist_created on conversation_history(created_at asc);

-- ============================================================
-- 13. RPC FUNCTIONS
-- ============================================================

-- Get or create customer record
create or replace function get_or_create_customer(
  p_store_id uuid,
  p_phone text,
  p_name text default null,
  p_language text default 'fr'
) returns jsonb as $$
declare
  v_customer record;
begin
  select * into v_customer from customers
  where store_id = p_store_id and phone = p_phone;
  if not found then
    insert into customers (store_id, phone, name, language, preferred_language)
    values (p_store_id, p_phone, coalesce(p_name, 'Customer'), p_language, p_language)
    returning * into v_customer;
  end if;
  return row_to_json(v_customer)::jsonb;
end;
$$ language plpgsql;

-- Get recent conversation history as array
create or replace function get_conversation_history(
  p_store_id uuid,
  p_phone text,
  p_limit int default 10
) returns jsonb as $$
declare
  v_history jsonb;
begin
  select coalesce(jsonb_agg(
    jsonb_build_object(
      'role', role,
      'message', message,
      'created_at', created_at,
      'message_type', message_type
    ) order by created_at desc
  ), '[]'::jsonb) into v_history
  from (
    select role, message, created_at, message_type
    from conversation_history
    where store_id = p_store_id and phone = p_phone
    order by created_at desc
    limit p_limit
  ) sub;
  return v_history;
end;
$$ language plpgsql;

-- Get AI memory for customer as JSON object
create or replace function get_ai_memory(
  p_store_id uuid,
  p_customer_id uuid
) returns jsonb as $$
declare
  v_memory jsonb;
begin
  select coalesce(jsonb_object_agg(key, value), '{}'::jsonb) into v_memory
  from ai_memory
  where store_id = p_store_id
    and customer_id = p_customer_id
    and (expires_at is null or expires_at > now());
  return v_memory;
end;
$$ language plpgsql;

-- Create or update AI memory
create or replace function upsert_ai_memory(
  p_store_id uuid,
  p_customer_id uuid,
  p_phone text,
  p_key text,
  p_value text,
  p_memory_type text default 'fact',
  p_confidence numeric(3,2) default 1.0
) returns jsonb as $$
declare
  v_memory record;
begin
  insert into ai_memory (store_id, customer_id, phone, key, value, memory_type, confidence)
  values (p_store_id, p_customer_id, p_phone, p_key, p_value, p_memory_type, p_confidence)
  on conflict (store_id, customer_id, key)
  do update set
    value = excluded.value,
    memory_type = excluded.memory_type,
    confidence = excluded.confidence,
    updated_at = now()
  returning * into v_memory;
  return row_to_json(v_memory)::jsonb;
end;
$$ language plpgsql;

-- Insert dead letter entry
create or replace function insert_dead_letter(
  p_store_id uuid,
  p_error_message text,
  p_error_code text default null,
  p_error_stack text default null,
  p_input_data jsonb default null,
  p_node_name text default null
) returns bigint as $$
declare
  v_id bigint;
begin
  insert into dead_letter_queue (store_id, error_message, error_code, error_stack, input_data, node_name)
  values (p_store_id, p_error_message, p_error_code, p_error_stack, p_input_data, p_node_name)
  returning id into v_id;
  return v_id;
end;
$$ language plpgsql;

-- Get or create active conversation
create or replace function get_or_create_conversation(
  p_store_id uuid,
  p_phone text,
  p_customer_id uuid default null,
  p_order_id uuid default null,
  p_trigger_type text default 'text_message',
  p_language text default 'fr'
) returns jsonb as $$
declare
  v_conv record;
begin
  select * into v_conv from ai_conversations
  where store_id = p_store_id
    and phone = p_phone
    and status = 'active'
  order by created_at desc
  limit 1;
  if not found then
    insert into ai_conversations (store_id, customer_id, order_id, phone, trigger_type, language)
    values (p_store_id, p_customer_id, p_order_id, p_phone, p_trigger_type, p_language)
    returning * into v_conv;
  end if;
  return row_to_json(v_conv)::jsonb;
end;
$$ language plpgsql;

-- Cleanup old data (run via pg_cron schedule)
create or replace function cleanup_ai_data()
returns void as $$
begin
  update ai_conversations
  set status = 'expired', updated_at = now()
  where status = 'active' and last_message_at < now() - interval '24 hours';
  delete from ai_analytics where created_at < now() - interval '90 days';
  delete from dead_letter_queue where created_at < now() - interval '30 days' and status = 'resolved';
  delete from conversation_history where created_at < now() - interval '90 days';
end;
$$ language plpgsql;
