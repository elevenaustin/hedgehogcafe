-- ============================================================
-- The Hedgehog Café - Supabase Database Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ============================================================

-- 1. Create orders table for live food orders
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    address TEXT NOT NULL,
    city TEXT DEFAULT 'Chandigarh',
    order_type TEXT NOT NULL DEFAULT 'Delivery',
    table_number TEXT,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
    delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    payment_method TEXT NOT NULL DEFAULT 'UPI on Delivery',
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'New',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Create bookings table for table reservations
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    guests TEXT NOT NULL DEFAULT '2',
    date TEXT NOT NULL,
    time_slot TEXT NOT NULL,
    seating_preference TEXT DEFAULT 'Near Bookshelves',
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create website_settings table for Super Admin controls
CREATE TABLE IF NOT EXISTS public.website_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    is_online BOOLEAN NOT NULL DEFAULT true,
    offline_reason TEXT DEFAULT '',
    announcement TEXT DEFAULT '',
    phone TEXT DEFAULT '+91 172 473 0478',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default website settings if not exists
INSERT INTO public.website_settings (id, is_online, offline_reason, announcement, phone, updated_at)
VALUES ('default', true, '', '', '+91 172 473 0478', NOW())
ON CONFLICT (id) DO NOTHING;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;

-- 5. Create Public Policies (Allows customers to create orders and admin to manage)
-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Public can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Public can view orders" ON public.orders;
DROP POLICY IF EXISTS "Public can update orders" ON public.orders;
DROP POLICY IF EXISTS "Public can delete orders" ON public.orders;

CREATE POLICY "Public can insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public can update orders" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Public can delete orders" ON public.orders FOR DELETE USING (true);

DROP POLICY IF EXISTS "Public can insert bookings" ON public.bookings;
DROP POLICY IF EXISTS "Public can view bookings" ON public.bookings;
DROP POLICY IF EXISTS "Public can update bookings" ON public.bookings;
DROP POLICY IF EXISTS "Public can delete bookings" ON public.bookings;

CREATE POLICY "Public can insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can view bookings" ON public.bookings FOR SELECT USING (true);
CREATE POLICY "Public can update bookings" ON public.bookings FOR UPDATE USING (true);
CREATE POLICY "Public can delete bookings" ON public.bookings FOR DELETE USING (true);

DROP POLICY IF EXISTS "Public can view settings" ON public.website_settings;
DROP POLICY IF EXISTS "Public can update settings" ON public.website_settings;

CREATE POLICY "Public can view settings" ON public.website_settings FOR SELECT USING (true);
CREATE POLICY "Public can update settings" ON public.website_settings FOR ALL USING (true);

-- 6. Enable Realtime on tables for live admin push notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.website_settings;
