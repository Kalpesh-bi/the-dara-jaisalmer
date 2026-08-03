import { Link } from 'react-router-dom';
import { Wifi, Wind, Tv, Coffee, Wine, Bath, LogOut } from 'lucide-react';
import type { RoomType } from '@/lib/types';

const AMENITY_ICONS: Record<string, typeof Wifi> = {
  WiFi: Wifi,
  AC: Wind,
  TV: Tv,
  Breakfast: Coffee,
  'Mini Bar': Wine,
  'Private Bathroom': Bath,
  'Shared Bathroom': Bath,
  Balcony: LogOut,
};

export default function RoomCard({ room }: { room: RoomType }) {
  return (
    <div className="card-luxury group">
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={room.image_url}
          alt={room.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent" />
        <div className="absolute top-4 left-4 glass px-3 py-1.5 rounded-full">
          <span className="text-xs font-sans uppercase tracking-[0.1em] text-charcoal">
            ₹{room.price.toLocaleString()}<span className="text-charcoal/50"> /night</span>
          </span>
        </div>
        {room.is_available ? (
          <div className="absolute top-4 right-4 bg-olive-500 text-white px-3 py-1.5 rounded-full text-xs font-sans uppercase tracking-[0.1em]">
            Available
          </div>
        ) : (
          <div className="absolute top-4 right-4 bg-charcoal/70 text-ivory px-3 py-1.5 rounded-full text-xs font-sans uppercase tracking-[0.1em]">
            Fully Booked
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-serif text-2xl text-charcoal mb-2">{room.name}</h3>
        <p className="text-sm text-charcoal/60 leading-[1.6] mb-4 line-clamp-2">{room.description}</p>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-5">
          {room.amenities.slice(0, 5).map((a) => {
            const Icon = AMENITY_ICONS[a];
            return (
              <span key={a} className="inline-flex items-center gap-1.5 text-xs text-charcoal/50 bg-gold-50 px-2.5 py-1 rounded-full">
                {Icon && <Icon size={12} />}
                {a}
              </span>
            );
          })}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-charcoal/40">Up to {room.max_guests} guests</span>
          <Link to="/booking" className="btn-gold !px-5 !py-2 !text-xs">
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
