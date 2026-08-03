import { Link } from 'react-router-dom';
import { ArrowRight, Wifi, Wind, Tv, Coffee, Wine, Bath, LogOut, Users } from 'lucide-react';
import { ROOMS, IMG } from '@/lib/data';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';

const AMENITY_ICONS: Record<string, typeof Wifi> = {
  WiFi: Wifi,
  AC: Wind,
  TV: Tv,
  Breakfast: Coffee,
  'Mini Bar': Wine,
  'Private Bathroom': Bath,
  'Shared Bathroom': Bath,
  Balcony: LogOut,
  'Living Area': Users,
  Terrace: LogOut,
  'Seating Area': Users,
  Locker: Users,
  'Private Area': Users,
};

export default function Rooms() {
  return (
    <>
      <PageHero
        image={IMG.heroCourtyard}
        title="Our Luxury Rooms"
        subtitle="From heritage superior rooms to spacious family suites and affordable shared accommodation."
        breadcrumb="Rooms"
      />

      <section className="py-20">
        <div className="container-luxury space-y-20">
          {ROOMS.map((room, i) => (
            <div
              key={room.id}
              className={`grid lg:grid-cols-2 gap-10 items-start ${i % 2 === 1 ? 'lg:[direction:rtl]' : ''}`}
            >
              {/* Gallery */}
              <div className="[direction:ltr] flex flex-col gap-3">
                <div className="w-full h-72 sm:h-80 overflow-hidden rounded-2xl">
                  <img src={room.image_url} alt={room.name} loading="lazy" className="w-full h-full object-cover" />
                </div>
                {room.gallery.slice(1, 3).length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {room.gallery.slice(1, 3).map((img, j) => (
                      <div key={j} className="h-40 overflow-hidden rounded-2xl">
                        <img src={img} alt={`${room.name} ${j + 2}`} loading="lazy" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="[direction:ltr]">
                <span className="section-label">Room {String(i + 1).padStart(2, '0')}</span>
                <h2 className="heading-3 mb-3">{room.name}</h2>
                <p className="text-body mb-6">{room.description}</p>

                <div className="flex items-center gap-4 mb-6">
                  <span className="font-serif text-3xl text-gold-600">₹{room.price.toLocaleString()}</span>
                  <span className="text-sm text-charcoal/50">/ night</span>
                  <span className="text-sm text-charcoal/40">•</span>
                  <span className="text-sm text-charcoal/50">Up to {room.max_guests} guests</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-8">
                  {room.amenities.map((a) => {
                    const Icon = AMENITY_ICONS[a];
                    return (
                      <div key={a} className="flex items-center gap-2 text-sm text-charcoal/60">
                        {Icon && <Icon size={16} className="text-gold-500" />}
                        {a}
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-4">
                  <Link to="/booking" className="btn-gold">Book Now</Link>
                  <Link to="/gallery" className="btn-ghost">View Gallery <ArrowRight size={16} /></Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gold-50">
        <div className="container-luxury text-center">
          <SectionHeading
            center
            title="Ready to Experience Royal Hospitality?"
            subtitle="Book your stay at The Dara Jaisalmer and create memories that last a lifetime."
          />
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/booking" className="btn-gold">Book Your Stay</Link>
            <Link to="/contact" className="btn-outline">Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  );
}
