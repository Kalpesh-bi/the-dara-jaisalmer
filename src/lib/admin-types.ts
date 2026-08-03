export type AdminRole = 'super_admin' | 'admin' | 'manager' | 'reception';

export interface AdminProfile {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: AdminRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminNotification {
  id: string;
  type: string;
  title: string;
  message: string | null;
  entity_id: string | null;
  is_read: boolean;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  admin_id: string | null;
  admin_email: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  details: Record<string, unknown>;
  created_at: string;
}

export interface LoginHistoryEntry {
  id: string;
  admin_id: string | null;
  email: string;
  ip_address: string | null;
  user_agent: string | null;
  success: boolean;
  failure_reason: string | null;
  created_at: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string | null;
  email: string;
  address: string | null;
  notes: string | null;
  created_at: string;
}

export interface Holiday {
  id: string;
  title: string;
  description: string | null;
  date: string;
  type: string;
  created_at: string;
}

export interface SiteSettings {
  id: number;
  hero_images: string[];
  whatsapp_number: string;
  contact_phone: string;
  contact_email: string;
  contact_address: string;
  seo_title: string;
  seo_description: string;
  seo_keywords: string[];
  offers: { title: string; description: string; code: string }[];
  updated_at: string;
}

export interface AdminBooking {
  id: string;
  guest_name: string;
  email: string;
  phone: string;
  country: string | null;
  adults: number;
  children: number;
  check_in: string | null;
  check_out: string | null;
  room_type: string | null;
  experience: string | null;
  pickup_required: boolean;
  pickup_location: string | null;
  drop_required: boolean;
  drop_location: string | null;
  number_of_days: number;
  special_request: string | null;
  coupon_code: string | null;
  estimated_price: number;
  taxes: number;
  discount: number;
  grand_total: number;
  status: string;
  payment_status: string;
  refund_status: string;
  razorpay_payment_id: string | null;
  transaction_id: string | null;
  payment_method: string | null;
  created_at: string;
}

export interface ContactEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: string;
  created_at: string;
}
