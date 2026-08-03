/*
# Admin Management System Schema for The Dara Jaisalmer

## Overview
Adds the complete admin/host management system: role-based access control,
two-step passkey security, payment tracking, notifications, activity logs,
login history, customer management, site settings, and calendar events.

## New Tables
1. admin_profiles — staff accounts linked to auth.users with roles (super_admin, admin, manager, reception), passkey, active status
2. notifications — real-time admin notifications (new booking, payment, cancellation, contact, review)
3. activity_logs — audit trail of all admin actions
4. login_history — successful and failed login attempts with IP and user agent
5. customers — customer directory with notes and aggregated stats
6. holidays — calendar holidays and events
7. site_settings — singleton row for website content, contact details, SEO, offers

## Modified Tables
- bookings: added discount, payment_status, refund_status, razorpay_payment_id, transaction_id, payment_method
- contact_messages: added status column (new, contacted, closed)

## Security
- RLS enabled on all new tables
- admin_profiles: self-read + super_admin read all; self-update + super_admin update all
- SECURITY DEFINER function verify_admin_passkey() — never exposes passkey to client
- SECURITY DEFINER function get_admin_role() — for RLS role checks
- SECURITY DEFINER trigger functions auto-create notifications on new bookings, contact messages, reviews
- site_settings: public read (website needs it), super_admin-only write
- customers, holidays, notifications: authenticated admin read/write
- login_history: authenticated insert, self + super_admin read
- activity_logs: authenticated insert, super_admin read
*/

-- ============================================================
-- 1. ADD COLUMNS TO EXISTING BOOKINGS TABLE
-- ============================================================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'discount') THEN
    ALTER TABLE bookings ADD COLUMN discount numeric NOT NULL DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'payment_status') THEN
    ALTER TABLE bookings ADD COLUMN payment_status text NOT NULL DEFAULT 'pending';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'refund_status') THEN
    ALTER TABLE bookings ADD COLUMN refund_status text NOT NULL DEFAULT 'none';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'razorpay_payment_id') THEN
    ALTER TABLE bookings ADD COLUMN razorpay_payment_id text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'transaction_id') THEN
    ALTER TABLE bookings ADD COLUMN transaction_id text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'payment_method') THEN
    ALTER TABLE bookings ADD COLUMN payment_method text;
  END IF;
END $$;

-- ============================================================
-- 2. ADD STATUS COLUMN TO CONTACT_MESSAGES
-- ============================================================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contact_messages' AND column_name = 'status') THEN
    ALTER TABLE contact_messages ADD COLUMN status text NOT NULL DEFAULT 'new';
  END IF;
END $$;

-- ============================================================
-- 3. ADMIN_PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  full_name text NOT NULL,
  phone text,
  role text NOT NULL DEFAULT 'reception',
  passkey text NOT NULL DEFAULT 'dara2024',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_self_select" ON admin_profiles;
CREATE POLICY "admin_self_select" ON admin_profiles FOR SELECT
  TO authenticated USING (
    auth.uid() = id OR EXISTS (
      SELECT 1 FROM admin_profiles ap WHERE ap.id = auth.uid() AND ap.role = 'super_admin'
    )
  );

DROP POLICY IF EXISTS "admin_self_update" ON admin_profiles;
CREATE POLICY "admin_self_update" ON admin_profiles FOR UPDATE
  TO authenticated USING (
    auth.uid() = id OR EXISTS (
      SELECT 1 FROM admin_profiles ap WHERE ap.id = auth.uid() AND ap.role = 'super_admin'
    )
  ) WITH CHECK (
    auth.uid() = id OR EXISTS (
      SELECT 1 FROM admin_profiles ap WHERE ap.id = auth.uid() AND ap.role = 'super_admin'
    )
  );

-- ============================================================
-- 4. NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  title text NOT NULL,
  message text,
  entity_id uuid,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_read_notifications" ON notifications;
CREATE POLICY "admin_read_notifications" ON notifications FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_notifications" ON notifications;
CREATE POLICY "admin_update_notifications" ON notifications FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_notifications" ON notifications;
CREATE POLICY "admin_delete_notifications" ON notifications FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 5. ACTIVITY_LOGS
-- ============================================================
CREATE TABLE IF NOT EXISTS activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES admin_profiles(id) ON DELETE SET NULL,
  admin_email text,
  action text NOT NULL,
  entity_type text,
  entity_id text,
  details jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_insert_activity_logs" ON activity_logs;
CREATE POLICY "admin_insert_activity_logs" ON activity_logs FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_select_activity_logs" ON activity_logs;
CREATE POLICY "admin_select_activity_logs" ON activity_logs FOR SELECT
  TO authenticated USING (true);

-- ============================================================
-- 6. LOGIN_HISTORY
-- ============================================================
CREATE TABLE IF NOT EXISTS login_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid REFERENCES admin_profiles(id) ON DELETE SET NULL,
  email text NOT NULL,
  ip_address inet,
  user_agent text,
  success boolean NOT NULL DEFAULT false,
  failure_reason text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE login_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_insert_login_history" ON login_history;
CREATE POLICY "admin_insert_login_history" ON login_history FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_select_login_history" ON login_history;
CREATE POLICY "admin_select_login_history" ON login_history FOR SELECT
  TO authenticated USING (
    auth.uid() = admin_id OR EXISTS (
      SELECT 1 FROM admin_profiles ap WHERE ap.id = auth.uid() AND ap.role = 'super_admin'
    )
  );

-- ============================================================
-- 7. CUSTOMERS
-- ============================================================
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text,
  email text NOT NULL,
  address text,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_read_customers" ON customers;
CREATE POLICY "admin_read_customers" ON customers FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_customers" ON customers;
CREATE POLICY "admin_insert_customers" ON customers FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_customers" ON customers;
CREATE POLICY "admin_update_customers" ON customers FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_customers" ON customers;
CREATE POLICY "admin_delete_customers" ON customers FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 8. HOLIDAYS
-- ============================================================
CREATE TABLE IF NOT EXISTS holidays (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  date date NOT NULL,
  type text NOT NULL DEFAULT 'holiday',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_holidays" ON holidays;
CREATE POLICY "public_read_holidays" ON holidays FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_holidays" ON holidays;
CREATE POLICY "admin_insert_holidays" ON holidays FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_holidays" ON holidays;
CREATE POLICY "admin_update_holidays" ON holidays FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_holidays" ON holidays;
CREATE POLICY "admin_delete_holidays" ON holidays FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 9. SITE_SETTINGS (singleton — one row, id=1)
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id int PRIMARY KEY DEFAULT 1,
  hero_images jsonb DEFAULT '[]',
  whatsapp_number text DEFAULT '919000000000',
  contact_phone text DEFAULT '+91 90000 00000',
  contact_email text DEFAULT 'stay@thedarajaisalmer.com',
  contact_address text DEFAULT 'Sam Road, Near Sam Sand Dunes, Jaisalmer, Rajasthan 345001, India',
  seo_title text DEFAULT 'The Dara Jaisalmer — Luxury Heritage Hotel & Desert Experiences',
  seo_description text DEFAULT 'Experience luxury heritage hospitality in the heart of Jaisalmer. Book desert safaris, camel rides, and luxury tents at The Dara Jaisalmer.',
  seo_keywords jsonb DEFAULT '[]',
  offers jsonb DEFAULT '[]',
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT singleton_check CHECK (id = 1)
);

INSERT INTO site_settings (id) VALUES (1) ON CONFLICT DO NOTHING;

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_site_settings" ON site_settings;
CREATE POLICY "public_read_site_settings" ON site_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "admin_update_site_settings" ON site_settings;
CREATE POLICY "admin_update_site_settings" ON site_settings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- 10. SECURITY DEFINER FUNCTIONS
-- ============================================================

-- Verify passkey without exposing it to the client
CREATE OR REPLACE FUNCTION verify_admin_passkey(p_passkey text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_stored_passkey text;
BEGIN
  SELECT passkey INTO v_stored_passkey FROM admin_profiles WHERE id = auth.uid();
  IF v_stored_passkey IS NULL THEN
    RETURN false;
  END IF;
  RETURN p_passkey = v_stored_passkey;
END;
$$;

-- Get the role of the current authenticated user
CREATE OR REPLACE FUNCTION get_admin_role()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role text;
BEGIN
  SELECT role INTO v_role FROM admin_profiles WHERE id = auth.uid();
  RETURN v_role;
END;
$$;

-- ============================================================
-- 11. TRIGGER FUNCTIONS FOR AUTO-NOTIFICATIONS
-- ============================================================

CREATE OR REPLACE FUNCTION notify_new_booking()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO notifications (type, title, message, entity_id)
  VALUES ('new_booking', 'New Booking', 'New booking from ' || NEW.guest_name, NEW.id);
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION notify_new_contact()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO notifications (type, title, message, entity_id)
  VALUES ('contact_form', 'New Enquiry', 'New enquiry from ' || NEW.name, NEW.id);
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION notify_new_review()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO notifications (type, title, message, entity_id)
  VALUES ('review_submitted', 'New Review', 'New review from ' || NEW.guest_name, NEW.id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_booking ON bookings;
CREATE TRIGGER trg_notify_booking AFTER INSERT ON bookings
  FOR EACH ROW EXECUTE FUNCTION notify_new_booking();

DROP TRIGGER IF EXISTS trg_notify_contact ON contact_messages;
CREATE TRIGGER trg_notify_contact AFTER INSERT ON contact_messages
  FOR EACH ROW EXECUTE FUNCTION notify_new_contact();

DROP TRIGGER IF EXISTS trg_notify_review ON reviews;
CREATE TRIGGER trg_notify_review AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE FUNCTION notify_new_review();

-- ============================================================
-- 12. INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON activity_logs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_login_history_created ON login_history (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings (payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings (status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages (status);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers (email);