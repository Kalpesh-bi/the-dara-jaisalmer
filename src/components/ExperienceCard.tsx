import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import type { Experience } from '@/lib/types';

export default function ExperienceCard({ experience }: { experience: Experience }) {
  return (
    <Link to={`/experiences/${experience.slug}`} className="group block">
      <div className="relative h-80 rounded-2xl overflow-hidden shadow-soft">
        <img
          src={experience.image_url}
          alt={experience.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-transparent" />

        <div className="absolute top-4 left-4 glass px-3 py-1.5 rounded-full">
          <span className="text-xs font-sans uppercase tracking-[0.1em] text-charcoal">{experience.category}</span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="font-serif text-2xl text-ivory mb-1">{experience.title}</h3>
          <p className="text-sm text-ivory/70 line-clamp-2 mb-3">{experience.short_description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-ivory/60">
              <span className="flex items-center gap-1.5">
                <Clock size={12} /> {experience.duration}
              </span>
              <span className="text-gold-300 font-sans">₹{experience.price.toLocaleString()}</span>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-sans uppercase tracking-[0.1em] text-gold-300 group-hover:gap-2 transition-all">
              Explore <ArrowRight size={14} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
