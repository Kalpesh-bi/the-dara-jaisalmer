import { Link } from 'react-router-dom';
import { UtensilsCrossed, Wine, Coffee, Users, Star, ArrowRight } from 'lucide-react';
import { IMG } from '@/lib/data';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import { useInView } from '@/components/hooks';

const MENU = [
  { category: 'Breakfast', items: [
    { name: 'Rajasthani Breakfast', desc: 'Gatte ki sabzi, besan chilla, fresh fruit, lassi', price: 350 },
    { name: 'Continental Breakfast', desc: 'Eggs, toast, cereal, fresh juice, coffee', price: 300 },
    { name: 'Paratha Platter', desc: 'Stuffed parathas, curd, pickle, butter', price: 250 },
  ]},
  { category: 'Lunch & Dinner', items: [
    { name: 'Royal Rajasthani Thali', desc: 'Dal baati churma, gatte ki sabzi, ker sangri, bajra roti, rice, dessert', price: 650 },
    { name: 'Laal Maas', desc: 'Spicy Rajasthani mutton curry with bajra roti', price: 550 },
    { name: 'Ker Sangri', desc: 'Desert berries and beans cooked in spices', price: 350 },
    { name: 'Gatte Ki Sabzi', desc: 'Gram flour dumplings in yogurt gravy', price: 300 },
    { name: 'Paneer Tikka Masala', desc: 'Grilled cottage cheese in rich tomato gravy', price: 400 },
  ]},
  { category: 'Desserts', items: [
    { name: 'Ghevar', desc: 'Traditional Rajasthani disc-shaped sweet', price: 200 },
    { name: 'Mohan Thaal', desc: 'Gram flour fudge with nuts', price: 180 },
    { name: 'Lassi', desc: 'Sweet or salted yogurt drink', price: 100 },
  ]},
];

export default function Restaurant() {
  return (
    <>
      <PageHero
        image={IMG.restaurant1}
        title="The Royal Dining"
        subtitle="Authentic Rajasthani cuisine and fine dining under the desert sky."
        breadcrumb="Restaurant"
      />

      {/* Intro */}
      <section className="py-24">
        <div className="container-luxury grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeading
              label="Dining at The Dara"
              title="A Taste of Rajasthan"
              subtitle="Our restaurant celebrates the rich culinary heritage of Rajasthan. From the fiery laal maas to the delicate ghevar, every dish is prepared by our master chef using locally sourced ingredients and traditional recipes passed down through generations."
            />
            <div className="mt-8 grid grid-cols-2 gap-4">
              <Feature icon={UtensilsCrossed} title="Traditional Food" desc="Authentic Rajasthani recipes" />
              <Feature icon={Wine} title="Private Dining" desc="Intimate dining experiences" />
              <Feature icon={Coffee} title="Breakfast Buffet" desc="Daily fresh breakfast" />
              <Feature icon={Users} title="Group Dining" desc="Perfect for gatherings" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src={IMG.restaurant2} alt="Restaurant interior" loading="lazy" className="rounded-2xl shadow-soft h-72 w-full object-cover" />
            <img src={IMG.food1} alt="Rajasthani thali" loading="lazy" className="rounded-2xl shadow-soft h-72 w-full object-cover mt-8" />
          </div>
        </div>
      </section>

      {/* Menu */}
      <section className="py-24 bg-gold-50">
        <div className="container-luxury">
          <SectionHeading center label="Our Menu" title="Signature Dishes" />
          <div className="mt-12 grid lg:grid-cols-3 gap-8">
            {MENU.map((section) => (
              <div key={section.category} className="card-luxury p-8">
                <h3 className="font-serif text-2xl text-gold-600 mb-6 pb-4 border-b border-gold-100">{section.category}</h3>
                <div className="space-y-5">
                  {section.items.map((item) => (
                    <div key={item.name}>
                      <div className="flex items-baseline justify-between gap-2">
                        <h4 className="font-serif text-lg text-charcoal">{item.name}</h4>
                        <span className="text-sm font-sans text-gold-600 whitespace-nowrap">₹{item.price}</span>
                      </div>
                      <p className="text-sm text-charcoal/50 mt-1">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chef */}
      <section className="py-24">
        <div className="container-luxury grid lg:grid-cols-2 gap-16 items-center">
          <img src={IMG.food2} alt="Chef" loading="lazy" className="rounded-2xl shadow-soft h-[500px] w-full object-cover" />
          <div>
            <SectionHeading label="Meet Our Chef" title="Master of Rajasthani Cuisine" />
            <p className="mt-6 text-body">
              With over 20 years of experience in Rajasthani and Indian cuisine, our chef brings passion and authenticity to every plate. Trained in the royal kitchens of Rajasthan, he specializes in traditional recipes that have been perfected over centuries.
            </p>
            <div className="mt-8 flex gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={18} className="fill-gold-400 text-gold-400" />)}
            </div>
            <p className="text-sm text-charcoal/50">Rated 4.9/5 by our guests</p>
          </div>
        </div>
      </section>

      {/* Reserve */}
      <section className="py-20 bg-charcoal">
        <div className="container-luxury text-center">
          <SectionHeading center light title="Reserve Your Table" subtitle="Book a memorable dining experience at The Dara Jaisalmer." />
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn-gold">Reserve a Table</Link>
            <Link to="/booking" className="btn-outline !border-ivory/40 !text-ivory hover:!bg-ivory/10">Book a Stay</Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Feature({ icon: Icon, title, desc }: { icon: typeof Wine; title: string; desc: string }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={`flex items-center gap-3 transition-all duration-500 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
      <div className="w-10 h-10 rounded-full bg-gold-50 flex items-center justify-center shrink-0">
        <Icon size={18} className="text-gold-600" />
      </div>
      <div>
        <p className="text-sm font-medium text-charcoal">{title}</p>
        <p className="text-xs text-charcoal/50">{desc}</p>
      </div>
    </div>
  );
}
