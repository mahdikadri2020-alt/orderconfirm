-- OrderConfirm DZ Database Schema

-- Users table (managed by Supabase Auth)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  role TEXT DEFAULT 'merchant' CHECK (role IN ('admin', 'merchant')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Stores (merchants)
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

ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

-- Profiles (users created from account requests)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT NOT NULL,
  store_name TEXT NOT NULL,
  whatsapp TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Account requests (leads)
CREATE TABLE IF NOT EXISTS public.account_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  store_name TEXT NOT NULL,
  wilaya TEXT NOT NULL,
  monthly_orders TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.account_requests ENABLE ROW LEVEL SECURITY;

-- Orders
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

-- Order activities (timeline)
CREATE TABLE IF NOT EXISTS public.order_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.order_activities ENABLE ROW LEVEL SECURITY;

-- Message templates
CREATE TABLE IF NOT EXISTS public.message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('confirmation', 'cancellation', 'reminder', 'follow_up')),
  content TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;

-- Settings
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value TEXT,
  UNIQUE(store_id, key)
);

ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_orders_store_id ON public.orders(store_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_account_requests_status ON public.account_requests(status);
CREATE INDEX IF NOT EXISTS idx_order_activities_order_id ON public.order_activities(order_id);

-- RLS Policies

-- Profiles: users can read own profile, admins can read all
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can read all profiles" ON public.profiles
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can update all profiles" ON public.profiles
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Users: can read own data
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Stores: merchants can read own store, admins can read all
CREATE POLICY "Merchants can read own store" ON public.stores
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can read all stores" ON public.stores
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Orders: merchants can CRUD own orders, admins can read all
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
