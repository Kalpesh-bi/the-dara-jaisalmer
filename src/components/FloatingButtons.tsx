import { useEffect, useState } from 'react';
import { Phone, ArrowUp } from 'lucide-react';
import { CONTACT } from '@/lib/data';

export default function FloatingButtons() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handler = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-12 h-12 rounded-full bg-charcoal text-ivory flex items-center justify-center shadow-soft-lg hover:bg-gold-500 transition-all duration-300 hover:scale-110"
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </button>
      )}
      <a
        href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}
        className="w-12 h-12 rounded-full bg-olive-500 text-white flex items-center justify-center shadow-soft-lg hover:bg-olive-600 transition-all duration-300 hover:scale-110"
        aria-label="Call us"
      >
        <Phone size={20} />
      </a>
      <a
        href={`https://wa.me/${CONTACT.whatsapp}?text=Hello%20The%20Dara%20Jaisalmer%2C%20I%20would%20like%20to%20book%20a%20stay`}
        target="_blank"
        rel="noreferrer"
        className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-soft-lg hover:scale-110 transition-all duration-300"
        aria-label="WhatsApp"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.47 14.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.67-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z"/><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.75 1.21h.04c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01C17.18 3.03 14.69 2 12.04 2z"/></svg>
      </a>
    </div>
  );
}
