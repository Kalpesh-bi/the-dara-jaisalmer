import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Clock, MapPin, Calendar, Check, X, Star, Quote,
  Phone, ArrowRight, ChevronRight, Plus, Minus
} from 'lucide-react';
import { EXPERIENCES, REVIEWS, CONTACT, IMG } from '@/lib/data';
import { useInView } from '@/components/hooks';
import SectionHeading from '@/components/SectionHeading';

export default function ExperienceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const experience = EXPERIENCES.find((e) => e.slug === slug);
  const [activeImage, setActiveImage] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!experience) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif text-charcoal mb-4">Experience Not Found</h1>
          <Link to="/experiences" className="btn-gold">Back to Experiences</Link>
        </div>
      </div>
    );
  }

  const related = EXPERIENCES.filter((e) => e.id !== experience.id && e.category === experience.category).slice(0, 3);
  const expReviews = REVIEWS.filter((r) => r.experience_id === experience.id);

  const faqs = [
    { q: 'What is the best time to visit?', a: `The best time for this experience is ${experience.best_time}. The weather is pleasant and ideal for desert activities.` },
    { q: 'Is pickup included?', a: 'Yes, pickup and drop from your hotel in Jaisalmer is included in the package. Please provide your hotel details at the time of booking.' },
    { q: 'What should I wear?', a: 'We recommend comfortable clothing, closed shoes, and a hat or scarf to protect from the sun. In winter evenings, a light jacket is advisable.' },
    { q: 'Can I customize this experience?', a: 'Absolutely! Contact us and we can tailor the experience to your preferences, group size, and schedule.' },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <img src={experience.image_url} alt={experience.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-charcoal/20" />
        <div className="absolute bottom-0 left-0 right-0 pb-12 z-10">
          <div className="container-luxury">
            <nav className="flex items-center gap-2 text-xs font-sans uppercase tracking-[0.15em] text-ivory/60 mb-4">
              <Link to="/" className="hover:text-gold-300">Home</Link>
              <ChevronRight size={12} />
              <Link to="/experiences" className="hover:text-gold-300">Experiences</Link>
              <ChevronRight size={12} />
              <span className="text-gold-300">{experience.title}</span>
            </nav>
            <span className="inline-block glass px-3 py-1.5 rounded-full text-xs font-sans uppercase tracking-[0.1em] text-charcoal mb-4">
              {experience.category}
            </span>
            <h1 className="text-hero font-serif font-light text-ivory mb-3">{experience.title}</h1>
            <p className="text-lg text-ivory/70 max-w-xl">{experience.short_description}</p>
            <div className="mt-6 flex flex-wrap gap-6 text-sm text-ivory/70">
              <span className="flex items-center gap-2"><Clock size={16} className="text-gold-300" /> {experience.duration}</span>
              <span className="flex items-center gap-2"><MapPin size={16} className="text-gold-300" /> {experience.location}</span>
              <span className="flex items-center gap-2"><Calendar size={16} className="text-gold-300" /> {experience.best_time}</span>
              <span className="text-gold-300 font-sans">From ₹{experience.price.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky booking bar */}
      <div className="sticky top-0 z-30 bg-ivory/95 backdrop-blur-xl border-b border-gold-100 py-3">
        <div className="container-luxury flex items-center justify-between">
          <div>
            <span className="font-serif text-xl text-charcoal">{experience.title}</span>
            <span className="ml-3 text-sm text-charcoal/50">From ₹{experience.price.toLocaleString()}</span>
          </div>
          <div className="flex gap-3">
            <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`} className="btn-ghost !hidden sm:!inline-flex">
              <Phone size={16} /> Call
            </a>
            <button onClick={() => navigate('/booking')} className="btn-gold !px-6 !py-2.5 !text-xs">Book Now</button>
          </div>
        </div>
      </div>

      {/* Overview */}
      <section className="py-20">
        <div className="container-luxury grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <SectionHeading label="Overview" title={`About ${experience.title}`} />
            <p className="mt-6 text-body text-lg">{experience.description}</p>

            {/* Highlights */}
            <div className="mt-12">
              <h3 className="heading-3 mb-6">Highlights</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {experience.highlights.map((h) => (
                  <div key={h} className="flex items-center gap-3 text-charcoal/70">
                    <span className="w-8 h-8 rounded-full bg-gold-100 flex items-center justify-center shrink-0">
                      <Check size={14} className="text-gold-600" />
                    </span>
                    {h}
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery */}
            <div className="mt-12">
              <h3 className="heading-3 mb-6">Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {experience.gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`rounded-2xl overflow-hidden aspect-[4/3] transition-all ${activeImage === i ? 'ring-2 ring-gold-400' : ''}`}
                  >
                    <img src={img} alt={`${experience.title} ${i + 1}`} loading="lazy" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                  </button>
                ))}
              </div>
            </div>

            {/* Itinerary */}
            {experience.itinerary.length > 0 && (
              <div className="mt-12">
                <h3 className="heading-3 mb-6">Itinerary</h3>
                <div className="space-y-4">
                  {experience.itinerary.map((item, i) => (
                    <ItineraryItem key={i} time={item.time} activity={item.activity} index={i} />
                  ))}
                </div>
              </div>
            )}

            {/* Included / Excluded */}
            <div className="mt-12 grid sm:grid-cols-2 gap-8">
              <div>
                <h3 className="font-serif text-xl text-charcoal mb-4">What's Included</h3>
                <ul className="space-y-3">
                  {experience.included.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-charcoal/70">
                      <Check size={16} className="text-olive-500 mt-0.5 shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-serif text-xl text-charcoal mb-4">What's Excluded</h3>
                <ul className="space-y-3">
                  {experience.excluded.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-charcoal/70">
                      <X size={16} className="text-red-400 mt-0.5 shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* FAQ */}
            <div className="mt-12">
              <h3 className="heading-3 mb-6">Frequently Asked Questions</h3>
              <div className="space-y-3">
                {faqs.map((faq, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-soft overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-5 text-left"
                    >
                      <span className="font-serif text-lg text-charcoal">{faq.q}</span>
                      {openFaq === i ? <Minus size={18} className="text-gold-600" /> : <Plus size={18} className="text-gold-600" />}
                    </button>
                    {openFaq === i && (
                      <div className="px-5 pb-5 text-sm text-charcoal/60 leading-[1.7] animate-fade-in">{faq.a}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Booking card */}
            <div className="card-luxury p-6 sticky top-20">
              <p className="text-sm text-charcoal/50 mb-1">Starting from</p>
              <p className="font-serif text-4xl text-gold-600 mb-1">₹{experience.price.toLocaleString()}</p>
              <p className="text-xs text-charcoal/40 mb-6">per person</p>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex items-center gap-3 text-charcoal/60">
                  <Clock size={16} className="text-gold-500" /> {experience.duration}
                </div>
                <div className="flex items-center gap-3 text-charcoal/60">
                  <MapPin size={16} className="text-gold-500" /> {experience.location}
                </div>
                <div className="flex items-center gap-3 text-charcoal/60">
                  <Calendar size={16} className="text-gold-500" /> {experience.best_time}
                </div>
              </div>

              <button onClick={() => navigate('/booking')} className="btn-gold w-full mb-3">Book Now</button>
              <a href={`https://wa.me/${CONTACT.whatsapp}?text=I%20would%20like%20to%20book%20${encodeURIComponent(experience.title)}`} target="_blank" rel="noreferrer" className="btn-outline w-full">
                WhatsApp Booking
              </a>
              <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`} className="btn-ghost w-full mt-2">
                <Phone size={16} /> {CONTACT.phone}
              </a>
            </div>

            {/* Map */}
            <div className="card-luxury overflow-hidden">
              <div className="aspect-video bg-gold-50 flex items-center justify-center">
                <div className="text-center p-6">
                  <MapPin size={32} className="text-gold-500 mx-auto mb-2" />
                  <p className="text-sm text-charcoal/60">{experience.location}</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Reviews */}
      {expReviews.length > 0 && (
        <section className="py-20 bg-gold-50">
          <div className="container-luxury">
            <SectionHeading center label="Guest Reviews" title="What Guests Say" />
            <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {expReviews.map((review) => (
                <div key={review.id} className="card-luxury p-8">
                  <Quote size={28} className="text-gold-300 mb-3" />
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
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="py-20">
          <div className="container-luxury">
            <SectionHeading center label="More Adventures" title="Related Experiences" />
            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((exp) => (
                <Link key={exp.id} to={`/experiences/${exp.slug}`} className="group block">
                  <div className="relative h-64 rounded-2xl overflow-hidden">
                    <img src={exp.image_url} alt={exp.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal to-transparent" />
                    <div className="absolute bottom-0 p-5">
                      <h4 className="font-serif text-xl text-ivory">{exp.title}</h4>
                      <span className="text-xs text-gold-300 flex items-center gap-1 mt-1 group-hover:gap-2 transition-all">
                        Explore <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function ItineraryItem({ time, activity, index }: { time: string; activity: string; index: number }) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`flex gap-4 transition-all duration-500 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-gold-400 text-white flex items-center justify-center text-xs font-sans font-medium shrink-0">
          {index + 1}
        </div>
        {index < 10 && <div className="w-px h-full bg-gold-100 mt-2" />}
      </div>
      <div className="pb-4">
        <p className="text-xs font-sans uppercase tracking-[0.1em] text-gold-600 mb-1">{time}</p>
        <p className="text-charcoal/70">{activity}</p>
      </div>
    </div>
  );
}
