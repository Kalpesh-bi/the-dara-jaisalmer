import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface PageHeroProps {
  image: string;
  title: string;
  subtitle?: string;
  breadcrumb?: string;
}

export default function PageHero({ image, title, subtitle, breadcrumb }: PageHeroProps) {
  return (
    <section className="relative h-[55vh] min-h-[400px] flex items-end overflow-hidden">
      <div className="absolute inset-0">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-charcoal/20" />
      </div>
      <div className="relative container-luxury pb-12 z-10">
        {breadcrumb && (
          <nav className="flex items-center gap-2 text-xs font-sans uppercase tracking-[0.15em] text-ivory/60 mb-3">
            <Link to="/" className="hover:text-gold-300">Home</Link>
            <ChevronRight size={12} />
            <span className="text-gold-300">{breadcrumb}</span>
          </nav>
        )}
        <h1 className="text-hero font-serif font-light text-ivory">{title}</h1>
        {subtitle && <p className="mt-3 text-lg text-ivory/70 max-w-xl">{subtitle}</p>}
      </div>
    </section>
  );
}
