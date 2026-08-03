import { Link } from 'react-router-dom';
import { Heart, Sparkles, Users, Calendar, ArrowRight } from 'lucide-react';
import { IMG } from '@/lib/data';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import { useInView } from '@/components/hooks';

const PACKAGES = [
  { name: 'Royal Heritage', price: '₹2,50,000', guests: 'Up to 100 guests', features: ['Venue decoration', 'Mandap setup', 'Traditional welcome', 'Rajasthani dinner buffet', 'Folk music performance'] },
  { name: 'Desert Dreams', price: '₹5,00,000', guests: 'Up to 200 guests', features: ['Desert venue at Sam Dunes', 'Luxury tent accommodation', 'Camel procession', 'Bonfire & cultural evening', 'Multi-cuisine dinner', 'Photography session'] },
  { name: 'Maharaja Royal', price: '₹10,00,000', guests: 'Up to 500 guests', features: ['Full hotel buyout', 'Grand palace decoration', 'Helicopter arrival option', 'Celebrity chef catering', '3-day celebration', 'Fireworks display', 'Spa for couple'] },
];

export default function Wedding() {
  return (
    <>
      <PageHero
        image={IMG.wedding1}
        title="Destination Weddings"
        subtitle="Celebrate your love in the golden city with a royal Rajasthani wedding."
        breadcrumb="Weddings"
      />

      {/* Intro */}
      <section className="py-24">
        <div className="container-luxury grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeading
              label="Weddings at The Dara"
              title="A Royal Celebration in the Desert"
              subtitle="Imagine exchanging vows against the backdrop of golden sand dunes, with the sounds of Rajasthani folk music and the warmth of a desert bonfire. The Dara Jaisalmer offers the perfect setting for a truly unforgettable destination wedding."
            />
            <div className="mt-8 grid grid-cols-2 gap-4">
              <Feature icon={Heart} title="Custom Decorations" desc="Bespoke wedding themes" />
              <Feature icon={Users} title="Up to 500 Guests" desc="Flexible venue spaces" />
              <Feature icon={Calendar} title="Multi-Day Events" desc="Sangeet, mehndi & more" />
              <Feature icon={Sparkles} title="Full Planning" desc="End-to-end coordination" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src={IMG.wedding2} alt="Wedding venue" loading="lazy" className="rounded-2xl shadow-soft h-72 w-full object-cover" />
            <img src={IMG.wedding3} alt="Wedding decor" loading="lazy" className="rounded-2xl shadow-soft h-72 w-full object-cover mt-8" />
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-20 bg-gold-50">
        <div className="container-luxury">
          <SectionHeading center label="Gallery" title="Wedding Moments" />
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[IMG.wedding1, IMG.wedding2, IMG.wedding3, IMG.wedding4, IMG.heroCourtyard, IMG.fort6, IMG.cultural1, IMG.restaurant3].map((img, i) => (
              <div key={i} className="aspect-square rounded-2xl overflow-hidden group">
                <img src={img} alt="Wedding" loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-24">
        <div className="container-luxury">
          <SectionHeading center label="Wedding Packages" title="Choose Your Celebration" subtitle="From intimate gatherings to grand celebrations, we have a package for every dream." />
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {PACKAGES.map((pkg, i) => (
              <div key={pkg.name} className={`card-luxury p-8 ${i === 1 ? 'ring-2 ring-gold-400' : ''}`}>
                {i === 1 && <span className="inline-block text-xs font-sans uppercase tracking-[0.1em] text-white bg-gradient-gold px-3 py-1 rounded-full mb-4">Most Popular</span>}
                <h3 className="font-serif text-2xl text-charcoal mb-2">{pkg.name}</h3>
                <p className="text-sm text-charcoal/50 mb-4">{pkg.guests}</p>
                <p className="font-serif text-3xl text-gold-600 mb-6">{pkg.price}</p>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-charcoal/60">
                      <span className="w-5 h-5 rounded-full bg-gold-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Sparkles size={10} className="text-gold-600" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/contact" className="btn-outline w-full">Enquire Now</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-charcoal">
        <div className="container-luxury text-center">
          <SectionHeading center light title="Let's Plan Your Dream Wedding" subtitle="Contact our wedding team for a personalized consultation." />
          <div className="mt-8">
            <Link to="/contact" className="btn-gold">Book Your Wedding <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Feature({ icon: Icon, title, desc }: { icon: typeof Heart; title: string; desc: string }) {
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
