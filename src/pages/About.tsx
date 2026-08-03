import { Link } from 'react-router-dom';
import { Award, Heart, Star, Users, ArrowRight } from 'lucide-react';
import { IMG, STATS } from '@/lib/data';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import AnimatedCounter from '@/components/AnimatedCounter';
import { useInView } from '@/components/hooks';

export default function About() {
  return (
    <>
      <PageHero
        image={IMG.heroHeritage}
        title="Our Story"
        subtitle="A heritage of hospitality in the golden city of Jaisalmer."
        breadcrumb="About"
      />

      {/* Intro */}
      <section className="py-24">
        <div className="container-luxury grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeading
              label="About The Dara"
              title="Where Heritage Meets the Desert"
              subtitle="The Dara Jaisalmer is more than a hotel — it is a gateway to the soul of Rajasthan. Built with golden sandstone and adorned with traditional Rajasthani craftsmanship, our heritage property offers an authentic yet luxurious experience in the heart of the Thar Desert."
            />
            <p className="mt-6 text-body">
              For over 15 years, we have welcomed travelers from across the globe, sharing with them the magic of Jaisalmer — its golden fort, its carved havelis, its vast dunes, and its vibrant culture. Every detail, from our rooms to our desert experiences, is crafted with care to create memories that last a lifetime.
            </p>
            <div className="mt-8 flex gap-4">
              <Link to="/booking" className="btn-gold">Book Your Stay</Link>
              <Link to="/experiences" className="btn-ghost">Experiences <ArrowRight size={16} /></Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src={IMG.fort1} alt="Jaisalmer Fort" loading="lazy" className="rounded-2xl shadow-soft h-72 w-full object-cover" />
            <img src={IMG.heroDesert1} alt="Desert" loading="lazy" className="rounded-2xl shadow-soft h-72 w-full object-cover mt-8" />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-gold-50">
        <div className="container-luxury">
          <SectionHeading center label="Our Values" title="What Makes Us Different" />
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <ValueCard icon={Heart} title="Authentic Hospitality" desc="We treat every guest like family, with the warmth and generosity that Rajasthan is known for." />
            <ValueCard icon={Award} title="Heritage Craftsmanship" desc="Our property showcases the finest sandstone carving and traditional Rajasthani architecture." />
            <ValueCard icon={Star} title="Curated Experiences" desc="Every safari, camp, and tour is designed by locals who know the desert intimately." />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-charcoal">
        <div className="container-luxury">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {STATS.map((stat) => (
              <AnimatedCounter key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} />
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24">
        <div className="container-luxury">
          <SectionHeading center label="Our Team" title="The People Behind The Dara" subtitle="A dedicated team of hospitality professionals, desert guides, and cultural experts who make every stay extraordinary." />
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Rajendra Singh', role: 'Founder & Host', img: IMG.fort7 },
              { name: 'Meera Devi', role: 'Guest Relations', img: IMG.cultural4 },
              { name: 'Khamma Khan', role: 'Head Desert Guide', img: IMG.camel4 },
              { name: 'Anita Sharma', role: 'Cultural Curator', img: IMG.cultural2 },
            ].map((member) => (
              <div key={member.name} className="text-center group">
                <div className="relative h-80 rounded-2xl overflow-hidden mb-4">
                  <img src={member.img} alt={member.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent" />
                </div>
                <h4 className="font-serif text-xl text-charcoal">{member.name}</h4>
                <p className="text-sm text-gold-600 mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <ParallaxAbout />
    </>
  );
}

function ValueCard({ icon: Icon, title, desc }: { icon: typeof Heart; title: string; desc: string }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div ref={ref} className={`text-center transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <div className="w-16 h-16 rounded-full bg-gradient-gold mx-auto flex items-center justify-center mb-5 shadow-gold">
        <Icon size={28} className="text-white" />
      </div>
      <h4 className="font-serif text-xl text-charcoal mb-3">{title}</h4>
      <p className="text-sm text-charcoal/60 leading-[1.7]">{desc}</p>
    </div>
  );
}

function ParallaxAbout() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <section ref={ref} className="relative h-[50vh] min-h-[350px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 transition-transform duration-1000"
        style={{
          backgroundImage: `url(${IMG.heroDesert1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />
      <div className="absolute inset-0 bg-charcoal/60" />
      <div className="relative z-10 text-center px-5 max-w-2xl">
        <h2 className="text-display font-serif font-light text-ivory mb-6">Experience the Magic of Jaisalmer</h2>
        <Link to="/booking" className="btn-gold">Begin Your Journey</Link>
      </div>
    </section>
  );
}
