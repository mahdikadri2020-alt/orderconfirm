-- Migration 002: Create missing tables (orders, stores, users, etc.)
-- Run this in the Supabase Dashboard SQL Editor

-- ========================================
-- 1. Create public.users table (if not exists)
-- ========================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  role TEXT DEFAULT 'merchant' CHECK (role IN ('admin', 'merchant')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Populate users from existing profiles
INSERT INTO public.users (id, email, name, role, created_at)
SELECT
  p.id,
  p.email,
  p.full_name,
  CASE WHEN p.role = 'admin' THEN 'admin' ELSE 'merchant' END,
  p.created_at
FROM public.profiles p
WHERE p.role IN ('customer', 'admin')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 2. Create public.stores table (if not exists)
-- ========================================
CREATE TABLE IF NOT EXISTS public.stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  store_name TEXT NOT NULL,
  wilaya TEXT,
  whatsapp_number TEXT,
  logo_url TEXT,
  subscription_plan TEXT DEFAULT 'starter' CHECK (subscription_plan IN ('starter', 'professional', 'enterprise')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Populate stores from existing profiles' store_name
INSERT INTO public.stores (user_id, store_name, wilaya, whatsapp_number)
SELECT
  p.id,
  p.store_name,
  NULL,
  p.whatsapp
FROM public.profiles p
WHERE p.role = 'customer' AND p.store_name IS NOT NULL
ON CONFLICT DO NOTHING;

ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 3. Create public.orders table (if not exists)
-- ========================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  product TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'no_response')),
  wilaya TEXT,
  commune TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 4. Create public.order_activities table (if not exists)
-- ========================================
CREATE TABLE IF NOT EXISTS public.order_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.order_activities ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 5. Create public.message_templates table (if not exists)
-- ========================================
CREATE TABLE IF NOT EXISTS public.message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('confirmation', 'cancellation', 'reminder', 'follow_up')),
  content TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 6. Create public.settings table (if not exists)
-- ========================================
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value TEXT,
  UNIQUE(store_id, key)
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 7. Indexes
-- ========================================
CREATE INDEX IF NOT EXISTS idx_orders_store_id ON public.orders(store_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_activities_order_id ON public.order_activities(order_id);

-- ========================================
-- 8. RLS Policies
-- ========================================

-- Users policies
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Stores policies
CREATE POLICY "Merchants can read own store" ON public.stores
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can read all stores" ON public.stores
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Orders policies
CREATE POLICY "Merchants can insert orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() IN (SELECT user_id FROM public.stores WHERE id = store_id));
CREATE POLICY "Merchants can read own orders" ON public.orders
  FOR SELECT USING (auth.uid() IN (SELECT user_id FROM public.stores WHERE id = store_id));
CREATE POLICY "Merchants can update own orders" ON public.orders
  FOR UPDATE USING (auth.uid() IN (SELECT user_id FROM public.stores WHERE id = store_id));
CREATE POLICY "Merchants can delete own orders" ON public.orders
  FOR DELETE USING (auth.uid() IN (SELECT user_id FROM public.stores WHERE id = store_id));
CREATE POLICY "Admins can read all orders" ON public.orders
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Order activities policies
CREATE POLICY "Merchants can read own order activities" ON public.order_activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      JOIN public.stores ON stores.id = orders.store_id
      WHERE orders.id = order_activities.order_id
        AND stores.user_id = auth.uid()
    )
  );
CREATE POLICY "Merchants can insert order activities" ON public.order_activities
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      JOIN public.stores ON stores.id = orders.store_id
      WHERE orders.id = order_activities.order_id
        AND stores.user_id = auth.uid()
    )
  );

-- Message templates policies
CREATE POLICY "Merchants can CRUD own templates" ON public.message_templates
  FOR ALL USING (auth.uid() IN (SELECT user_id FROM public.stores WHERE id = store_id));

-- Settings policies
CREATE POLICY "Merchants can CRUD own settings" ON public.settings
  FOR ALL USING (auth.uid() IN (SELECT user_id FROM public.stores WHERE id = store_id));
