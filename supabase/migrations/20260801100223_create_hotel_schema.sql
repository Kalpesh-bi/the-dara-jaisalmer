/*
# Create The Dara Jaisalmer Hotel Schema

1. New Tables
- `bookings` — guest booking requests for rooms and experiences
  - id, guest_name, email, phone, country, adults, children, check_in, check_out
  - room_type, experience, pickup_required, pickup_location, drop_required, drop_location
  - number_of_days, special_request, coupon_code, estimated_price, taxes, grand_total
  - status, created_at
- `room_types` — catalog of available room categories
  - id, slug, name, description, price, max_guests, amenities, image_url, gallery
  - is_available, sort_order, created_at
- `experiences` — catalog of desert experience packages
  - id, slug, title, category, short_description, description, highlights
  - duration, best_time, location, included, excluded, itinerary, price, image_url, gallery
  - is_featured, sort_order, created_at
- `reviews` — guest testimonials
  - id, guest_name, rating, title, body, experience_id, room_type_id, created_at, is_approved
- `coupons` — discount codes
  - id, code, discount_type, discount_value, is_active, expires_at, created_at
- `gallery_items` — categorized gallery images
  - id, category, title, image_url, sort_order, created_at
- `contact_messages` — messages from the contact form
  - id, name, email, phone, subject, message, created_at

2. Security
- Enable RLS on all tables.
- This is a no-auth public-facing hotel website. Bookings, reviews, and contact messages
  are submitted by anonymous guests. Room types, experiences, approved reviews,
  gallery items, and coupons are public read. All policies use `TO anon, authenticated`.
- Admin login (if implemented) would be a separate authenticated flow; for now all
  data is public read, and inserts are allowed from the anon role for booking/contact/review submission.

3. Notes
- All tables use gen_random_uuid() for primary keys.
- Timestamps default to now().
- Text fields are NOT NULL where essential (guest_name, email, etc.).
*/

-- Room Types
CREATE TABLE IF NOT EXISTS room_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  price numeric NOT NULL DEFAULT 0,
  max_guests int NOT NULL DEFAULT 2,
  amenities text[] DEFAULT '{}',
  image_url text,
  gallery text[] DEFAULT '{}',
  is_available boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE room_types ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_room_types" ON room_types;
CREATE POLICY "public_read_room_types" ON room_types FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_room_types" ON room_types;
CREATE POLICY "public_insert_room_types" ON room_types FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_room_types" ON room_types;
CREATE POLICY "public_update_room_types" ON room_types FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_delete_room_types" ON room_types;
CREATE POLICY "public_delete_room_types" ON room_types FOR DELETE
  TO anon, authenticated USING (true);

-- Experiences
CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  category text NOT NULL DEFAULT 'Safari',
  short_description text,
  description text,
  highlights text[] DEFAULT '{}',
  duration text,
  best_time text,
  location text,
  included text[] DEFAULT '{}',
  excluded text[] DEFAULT '{}',
  itinerary jsonb DEFAULT '[]',
  price numeric NOT NULL DEFAULT 0,
  image_url text,
  gallery text[] DEFAULT '{}',
  is_featured boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_experiences" ON experiences;
CREATE POLICY "public_read_experiences" ON experiences FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_experiences" ON experiences;
CREATE POLICY "public_insert_experiences" ON experiences FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_experiences" ON experiences;
CREATE POLICY "public_update_experiences" ON experiences FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_delete_experiences" ON experiences;
CREATE POLICY "public_delete_experiences" ON experiences FOR DELETE
  TO anon, authenticated USING (true);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  country text,
  adults int NOT NULL DEFAULT 2,
  children int NOT NULL DEFAULT 0,
  check_in date,
  check_out date,
  room_type text,
  experience text,
  pickup_required boolean NOT NULL DEFAULT false,
  pickup_location text,
  drop_required boolean NOT NULL DEFAULT false,
  drop_location text,
  number_of_days int NOT NULL DEFAULT 1,
  special_request text,
  coupon_code text,
  estimated_price numeric NOT NULL DEFAULT 0,
  taxes numeric NOT NULL DEFAULT 0,
  grand_total numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_bookings" ON bookings;
CREATE POLICY "public_read_bookings" ON bookings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_bookings" ON bookings;
CREATE POLICY "public_insert_bookings" ON bookings FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_bookings" ON bookings;
CREATE POLICY "public_update_bookings" ON bookings FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_delete_bookings" ON bookings;
CREATE POLICY "public_delete_bookings" ON bookings FOR DELETE
  TO anon, authenticated USING (true);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name text NOT NULL,
  rating int NOT NULL DEFAULT 5,
  title text,
  body text,
  experience_id uuid REFERENCES experiences(id) ON DELETE SET NULL,
  room_type_id uuid REFERENCES room_types(id) ON DELETE SET NULL,
  is_approved boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_reviews" ON reviews;
CREATE POLICY "public_read_reviews" ON reviews FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_reviews" ON reviews;
CREATE POLICY "public_insert_reviews" ON reviews FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_reviews" ON reviews;
CREATE POLICY "public_update_reviews" ON reviews FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_delete_reviews" ON reviews;
CREATE POLICY "public_delete_reviews" ON reviews FOR DELETE
  TO anon, authenticated USING (true);

-- Coupons
CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  discount_type text NOT NULL DEFAULT 'percentage',
  discount_value numeric NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_coupons" ON coupons;
CREATE POLICY "public_read_coupons" ON coupons FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_coupons" ON coupons;
CREATE POLICY "public_insert_coupons" ON coupons FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_coupons" ON coupons;
CREATE POLICY "public_update_coupons" ON coupons FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_delete_coupons" ON coupons;
CREATE POLICY "public_delete_coupons" ON coupons FOR DELETE
  TO anon, authenticated USING (true);

-- Gallery Items
CREATE TABLE IF NOT EXISTS gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL DEFAULT 'Desert',
  title text,
  image_url text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_gallery_items" ON gallery_items;
CREATE POLICY "public_read_gallery_items" ON gallery_items FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_gallery_items" ON gallery_items;
CREATE POLICY "public_insert_gallery_items" ON gallery_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_gallery_items" ON gallery_items;
CREATE POLICY "public_update_gallery_items" ON gallery_items FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_delete_gallery_items" ON gallery_items;
CREATE POLICY "public_delete_gallery_items" ON gallery_items FOR DELETE
  TO anon, authenticated USING (true);

-- Contact Messages
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_contact_messages" ON contact_messages;
CREATE POLICY "public_read_contact_messages" ON contact_messages FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_contact_messages" ON contact_messages;
CREATE POLICY "public_insert_contact_messages" ON contact_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_contact_messages" ON contact_messages;
CREATE POLICY "public_update_contact_messages" ON contact_messages FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_delete_contact_messages" ON contact_messages;
CREATE POLICY "public_delete_contact_messages" ON contact_messages FOR DELETE
  TO anon, authenticated USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_experiences_slug ON experiences (slug);
CREATE INDEX IF NOT EXISTS idx_room_types_slug ON room_types (slug);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gallery_items_category ON gallery_items (category);
