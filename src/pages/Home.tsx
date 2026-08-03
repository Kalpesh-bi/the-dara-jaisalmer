import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { ROOMS, EXPERIENCES, REVIEWS, STATS, IMG } from '@/lib/data';
import RoomCard from '@/components/RoomCard';
import ExperienceCard from '@/components/ExperienceCard';
import AnimatedCounter from '@/components/AnimatedCounter';
import SectionHeading from '@/components/SectionHeading';
import BookingWidget from '@/components/BookingWidget';
import { useInView } from '@/components/hooks';

const HERO_SLIDES = [
  { image: IMG.heroDesert1, headline: 'Experience Luxury in the Heart of Jaisalmer', subtitle: 'Stay among history, culture and unforgettable desert adventures.' },
  { image: IMG.heroHeritage, headline: 'A Heritage of Royal Hospitality', subtitle: 'Where golden sandstone meets timeless Rajasthani elegance.' },
  { image: IMG.heroDesert3, headline: 'Unforgettable Desert Experiences', subtitle: 'Camel safaris, starlit nights, and the magic of the Thar Desert.' },
];

export default function Home() {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((s) => (s + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const featuredExperiences = EXPERIENCES.filter((e) => e.is_featured).slice(0, 6);

  return (
    <>
      {/* Hero Slider */}
      <section className="relative h-screen min-h-[600px] overflow-hidden">
        {HERO_SLIDES.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === slide ? 'opacity-100' : 'opacity-0'}`}
          >
            <img src={s.image} alt="Desert landscape" className={`w-full h-full object-cover ${i === slide ? 'animate-slow-zoom' : ''}`} />
            <div className="absolute inset-0 bg-gradient-to-b from-charcoal/50 via-charcoal/30 to-charcoal/70" />
          </div>
        ))}

        {/* Hero content */}
        <div className="relative h-full flex flex-col items-center justify-center text-center px-5 z-10">
          <div className="max-w-3xl">
            <p className="text-xs font-sans uppercase tracking-[0.4em] text-gold-300 mb-6 animate-fade-in">
              Luxury • Heritage • Desert Experiences
            </p>
            <h1 className="text-hero font-serif font-light text-ivory text-balance animate-fade-up">
              {HERO_SLIDES[slide].headline}
            </h1>
            <p className="mt-6 text-lg text-ivory/80 max-w-xl mx-auto animate-fade-up">
              {HERO_SLIDES[slide].subtitle}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center animate-fade-up">
              <Link to="/booking" className="btn-gold">Book Now</Link>
              <Link to="/experiences" className="btn-outline !border-ivory/40 !text-ivory hover:!bg-ivory/10">
                Explore Experiences
              </Link>
            </div>
          </div>
        </div>

        {/* Slide controls */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === slide ? 'w-10 bg-gold-400' : 'w-3 bg-ivory/40'}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Slide arrows */}
        <button
          onClick={() => setSlide((s) => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass-dark flex items-center justify-center text-ivory hover:bg-gold-400 transition-all z-20"
          aria-label="Previous"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => setSlide((s) => (s + 1) % HERO_SLIDES.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass-dark flex items-center justify-center text-ivory hover:bg-gold-400 transition-all z-20"
          aria-label="Next"
        >
          <ChevronRight size={20} />
        </button>
      </section>

      {/* Booking Widget */}
      <section className="relative z-20 -mt-20 px-5">
        <BookingWidget />
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

      {/* Welcome / Intro */}
      <section className="py-24">
        <div className="container-luxury grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeading
              label="Welcome to The Dara"
              title="A Golden City Heritage Retreat"
              subtitle="Nestled in the heart of Jaisalmer, The Dara offers a rare blend of royal Rajasthani heritage and modern luxury. From intricately carved sandstone architecture to the vast expanse of the Thar Desert, every moment is crafted to be unforgettable."
            />
            <div className="mt-8 flex gap-4">
              <Link to="/about" className="btn-gold">Our Story</Link>
              <Link to="/experiences" className="btn-ghost">Discover Experiences <ArrowRight size={16} /></Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src={IMG.heroCourtyard} alt="Heritage courtyard" loading="lazy" className="rounded-2xl shadow-soft h-72 object-cover w-full" />
            <img src={IMG.heroDesert2} alt="Desert dunes" loading="lazy" className="rounded-2xl shadow-soft h-72 object-cover w-full mt-8" />
          </div>
        </div>
      </section>

      {/* Rooms */}
      <section className="py-24 bg-gold-50">
        <div className="container-luxury">
          <SectionHeading
            center
            label="Accommodation"
            title="Our Luxury Rooms"
            subtitle="From intimate superior rooms to spacious family suites and affordable shared accommodation — find your perfect stay."
          />
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ROOMS.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/rooms" className="btn-outline">View All Rooms <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* Experiences */}
      <section className="py-24">
        <div className="container-luxury">
          <SectionHeading
            center
            label="Desert Adventures"
            title="Unforgettable Experiences"
            subtitle="Camel safaris across golden dunes, nights under a star-filled sky, border tours steeped in history, and the cultural soul of Rajasthan."
          />
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredExperiences.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/experiences" className="btn-gold">All Experiences <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* Parallax CTA */}
      <ParallaxCTA />

      {/* Testimonials */}
      <section className="py-24 bg-gold-50">
        <div className="container-luxury">
          <SectionHeading
            center
            label="Guest Stories"
            title="What Our Guests Say"
            subtitle="Real experiences from travelers who discovered the magic of The Dara Jaisalmer."
          />
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {REVIEWS.slice(0, 6).map((review) => (
              <div key={review.id} className="card-luxury p-8">
                <Quote size={32} className="text-gold-300 mb-4" />
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} size={14} className="fill-gold-400 text-gold-400" />
                  ))}
                </div>
                <h4 className="font-serif text-lg text-charcoal mb-2">{review.title}</h4>
                <p className="text-sm text-charcoal/60 leading-[1.7] mb-4">{review.body}</p>
                <p className="text-xs font-sans uppercase tracking-[0.1em] text-gold-600">— {review.guest_name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram / CTA */}
      <section className="py-24">
        <div className="container-luxury text-center">
          <SectionHeading
            center
            label="Stay Connected"
            title="Follow Our Journey"
            subtitle="Discover the beauty of Jaisalmer through our lens. Tag us in your desert adventures."
          />
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[IMG.camel3, IMG.camp3, IMG.cultural2, IMG.fort1, IMG.dunes2, IMG.room7, IMG.wedding1, IMG.food1].map((img, i) => (
              <div key={i} className="aspect-square rounded-2xl overflow-hidden group cursor-pointer">
                <img src={img} alt="Instagram" loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ParallaxCTA() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <section ref={ref} className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
      <div
        className={`absolute inset-0 transition-transform duration-1000 ${inView ? 'scale-100' : 'scale-110'}`}
        style={{
          backgroundImage: `url(${IMG.camp5})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />
      <div className="absolute inset-0 bg-charcoal/60" />
      <div className="relative z-10 text-center px-5 max-w-2xl">
        <p className="text-xs font-sans uppercase tracking-[0.4em] text-gold-300 mb-4">A Night to Remember</p>
        <h2 className="text-display font-serif font-light text-ivory mb-6">
          Sleep Under the Desert Stars
        </h2>
        <p className="text-lg text-ivory/70 mb-8">
          Experience the silence of the Thar, a private bonfire, live folk music, and a canopy of a million stars above your bed.
        </p>
        <Link to="/experiences/sleeping-under-the-stars" className="btn-gold">Book This Experience</Link>
      </div>
    </section>
  );
}
