import { useState } from 'react';
import { X } from 'lucide-react';
import { GALLERY_ITEMS, GALLERY_CATEGORIES, IMG } from '@/lib/data';
import PageHero from '@/components/PageHero';
import { useInView } from '@/components/hooks';

export default function Gallery() {
  const [filter, setFilter] = useState('All');
  const [lightbox, setLightbox] = useState<string | null>(null);

  const filtered = filter === 'All' ? GALLERY_ITEMS : GALLERY_ITEMS.filter((g) => g.category === filter);

  return (
    <>
      <PageHero
        image={IMG.dunes2}
        title="Gallery"
        subtitle="A visual journey through the golden city, the desert, and the luxury of The Dara Jaisalmer."
        breadcrumb="Gallery"
      />

      {/* Filter */}
      <section className="py-10 border-b border-gold-100">
        <div className="container-luxury flex flex-wrap gap-3 justify-center">
          {GALLERY_CATEGORIES.map((cat) => (
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

      {/* Masonry Grid */}
      <section className="py-20">
        <div className="container-luxury">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
            {filtered.map((item, i) => (
              <GalleryCard key={item.id} item={item} index={i} onClick={() => setLightbox(item.image_url)} />
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[70] bg-charcoal/90 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in" onClick={() => setLightbox(null)}>
          <button className="absolute top-6 right-6 w-12 h-12 rounded-full glass-dark flex items-center justify-center text-ivory hover:text-gold-300" onClick={() => setLightbox(null)}>
            <X size={24} />
          </button>
          <img src={lightbox} alt="Gallery" className="max-w-full max-h-[85vh] rounded-2xl object-contain" />
        </div>
      )}
    </>
  );
}

function GalleryCard({ item, index, onClick }: { item: { title: string; image_url: string; category: string }; index: number; onClick: () => void }) {
  const { ref, inView } = useInView<HTMLButtonElement>(0.1);
  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`mb-4 block w-full overflow-hidden rounded-2xl group transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${(index % 6) * 80}ms` }}
    >
      <div className="relative">
        <img src={item.image_url} alt={item.title} loading="lazy" className="w-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute bottom-0 left-0 p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <p className="text-xs font-sans uppercase tracking-[0.1em] text-gold-300">{item.category}</p>
          <p className="font-serif text-lg text-ivory">{item.title}</p>
        </div>
      </div>
    </button>
  );
}
