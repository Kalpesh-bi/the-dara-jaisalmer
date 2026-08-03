import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { CONTACT } from '@/lib/data';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Rooms', path: '/rooms' },
  { label: 'Experiences', path: '/experiences' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Restaurant', path: '/restaurant' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMegaOpen(false);
  }, [location.pathname]);

  const isHome = location.pathname === '/';
  const transparent = isHome && !scrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          transparent
            ? 'bg-transparent py-6'
            : 'bg-ivory/95 backdrop-blur-xl shadow-soft py-4'
        }`}
      >
        <nav className="container-luxury flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0 pl-1 pr-3 md:px-4">
            <div className="relative h-[50px] w-[50px] sm:h-[58px] sm:w-[58px] md:h-[70px] md:w-[70px] rounded-full overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.10)] ring-1 ring-gold-200/40 transition-all duration-500 hover:shadow-[0_6px_24px_rgba(0,0,0,0.15)]">
              <img
                src="/Gemini_Generated_Image_686qs5686qs5686q.png"
                alt="The Dara Jaisalmer"
                className="h-full w-full object-cover scale-[1.35]"
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) =>
              link.label === 'Experiences' ? (
                <div
                  key={link.path}
                  className="relative"
                  onMouseEnter={() => setMegaOpen(true)}
                  onMouseLeave={() => setMegaOpen(false)}
                >
                  <Link
                    to={link.path}
                    className={`px-4 py-2 text-sm font-sans uppercase tracking-[0.1em] transition-colors ${
                      transparent ? 'text-white/90 hover:text-gold-200' : 'text-charcoal/80 hover:text-gold-600'
                    }`}
                  >
                    {link.label}
                  </Link>
                  {megaOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2">
                      <div className="w-[600px] glass rounded-2xl shadow-soft-lg p-6 grid grid-cols-2 gap-4">
                        <MegaLink to="/experiences/camel-safari" title="Camel Safari" desc="Traditional desert caravan" />
                        <MegaLink to="/experiences/jeep-safari" title="Jeep Safari" desc="4x4 off-road adventure" />
                        <MegaLink to="/experiences/sam-sand-dunes-camp" title="Sam Sand Dunes Camp" desc="Luxury Swiss tent camping" />
                        <MegaLink to="/experiences/sleeping-under-the-stars" title="Sleeping Under the Stars" desc="Open-air desert night" />
                        <MegaLink to="/experiences/india-pakistan-border-tour" title="Border Tour" desc="Tanot & Longewala" />
                        <MegaLink to="/experiences/jaisalmer-city-tour" title="City Tour" desc="Havelis, Fort & Lake" />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 text-sm font-sans uppercase tracking-[0.1em] transition-colors ${
                    transparent ? 'text-white/90 hover:text-gold-200' : 'text-charcoal/80 hover:text-gold-600'
                  } ${location.pathname === link.path ? (transparent ? 'text-gold-200' : 'text-gold-600') : ''}`}
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <a
              href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}
              className={`hidden md:flex items-center gap-2 text-sm font-sans transition-colors ${transparent ? 'text-white/90 hover:text-gold-200' : 'text-charcoal/70 hover:text-gold-600'}`}
            >
              <Phone size={16} />
              <span className="hidden xl:inline">{CONTACT.phone}</span>
            </a>
            <Link to="/booking" className="hidden sm:inline-flex btn-gold !px-6 !py-2.5 !text-xs">
              Book Now
            </Link>
            <button
              onClick={() => setMobileOpen(true)}
              className={`lg:hidden p-2 transition-colors ${transparent ? 'text-white' : 'text-charcoal'}`}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-ivory shadow-soft-lg flex flex-col animate-fade-in">
            <div className="flex items-center justify-between p-6 border-b border-gold-100">
              <div className="relative h-[48px] w-[48px] rounded-full overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.10)] ring-1 ring-gold-200/40">
                <img src="/Gemini_Generated_Image_686qs5686qs5686q.png" alt="The Dara Jaisalmer" className="h-full w-full object-cover scale-[1.35]" />
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-2 text-charcoal/60 hover:text-charcoal">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3 text-sm font-sans uppercase tracking-[0.1em] rounded-xl transition-colors ${
                    location.pathname === link.path ? 'bg-gold-50 text-gold-700' : 'text-charcoal/80 hover:bg-gold-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/admin" className="block px-4 py-3 text-sm font-sans uppercase tracking-[0.1em] text-charcoal/50 hover:bg-gold-50 rounded-xl">
                Admin Login
              </Link>
            </div>
            <div className="p-6 border-t border-gold-100 space-y-3">
              <Link to="/booking" className="btn-gold w-full">Book Now</Link>
              <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`} className="btn-outline w-full">
                <Phone size={16} /> Call Us
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MegaLink({ to, title, desc }: { to: string; title: string; desc: string }) {
  return (
    <Link to={to} className="block p-3 rounded-xl hover:bg-gold-50 transition-colors group">
      <p className="font-serif text-lg text-charcoal group-hover:text-gold-700">{title}</p>
      <p className="text-xs text-charcoal/50">{desc}</p>
    </Link>
  );
}
