export interface RoomType {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  max_guests: number;
  amenities: string[];
  image_url: string;
  gallery: string[];
  is_available: boolean;
  sort_order: number;
}

export interface Experience {
  id: string;
  slug: string;
  title: string;
  category: string;
  short_description: string;
  description: string;
  highlights: string[];
  duration: string;
  best_time: string;
  location: string;
  included: string[];
  excluded: string[];
  itinerary: { time: string; activity: string }[];
  price: number;
  image_url: string;
  gallery: string[];
  is_featured: boolean;
  sort_order: number;
}

export interface Review {
  id: string;
  guest_name: string;
  rating: number;
  title: string;
  body: string;
  experience_id: string | null;
  room_type_id: string | null;
  is_approved: boolean;
  created_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  is_active: boolean;
  expires_at: string | null;
}

export interface GalleryItem {
  id: string;
  category: string;
  title: string;
  image_url: string;
  sort_order: number;
}

export interface Booking {
  id?: string;
  guest_name: string;
  email: string;
  phone: string;
  country?: string;
  adults: number;
  children: number;
  check_in?: string;
  check_out?: string;
  room_type?: string;
  experience?: string;
  pickup_required: boolean;
  pickup_location?: string;
  drop_required: boolean;
  drop_location?: string;
  number_of_days: number;
  special_request?: string;
  coupon_code?: string;
  estimated_price: number;
  taxes: number;
  grand_total: number;
  status?: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}
