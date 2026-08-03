import { useState } from 'react';
import { EXPERIENCES, IMG } from '@/lib/data';
import PageHero from '@/components/PageHero';
import ExperienceCard from '@/components/ExperienceCard';
import SectionHeading from '@/components/SectionHeading';

const CATEGORIES = ['All', 'Safari', 'Adventure', 'Desert Camp', 'Culture', 'Tour'];

export default function Experiences() {
  const [filter, setFilter] = useState('All');
  const filtered = filter === 'All' ? EXPERIENCES : EXPERIENCES.filter((e) => e.category === filter);

  return (
    <>
      <PageHero
        image={IMG.camel1}
        title="Desert Experiences"
        subtitle="Camel safaris, desert camps, border tours, cultural evenings, and more — curated adventures in the heart of the Thar."
        breadcrumb="Experiences"
      />

      {/* Filter */}
      <section className="py-12 border-b border-gold-100">
        <div className="container-luxury flex flex-wrap gap-3 justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-sans uppercase tracking-[0.1em] transition-all duration-300 ${
                filter === cat
                  ? 'bg-gradient-gold text-white shadow-gold'
                  : 'bg-white text-charcoal/60 hover:bg-gold-50 hover:text-gold-700 border border-gold-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="py-20">
        <div className="container-luxury">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-charcoal">
        <div className="container-luxury text-center">
          <SectionHeading
            center
            light
            title="Can't Decide? Let Us Help."
            subtitle="Contact our team and we'll craft the perfect desert experience tailored to your preferences."
          />
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/919000000000" target="_blank" rel="noreferrer" className="btn-gold">WhatsApp Us</a>
          </div>
        </div>
      </section>
    </>
  );
}
