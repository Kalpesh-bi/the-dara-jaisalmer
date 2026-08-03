import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Clock } from 'lucide-react';
import { CONTACT } from '@/lib/data';

export default function Footer() {
  return (
    <footer className="bg-charcoal text-ivory/80">
      <div className="container-luxury py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block mb-5">
              <img
                src="/Gemini_Generated_Image_686qs5686qs5686q.png"
                alt="The Dara Jaisalmer"
                className="h-[68px] w-auto object-contain"
              />
            </Link>
            <p className="text-sm leading-[1.7] text-ivory/60">
              A premium heritage hotel in the heart of Jaisalmer, offering luxury accommodation and unforgettable desert experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-sans uppercase tracking-[0.2em] text-gold-400 mb-5">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/rooms" className="hover:text-gold-300 transition-colors">Rooms</Link></li>
              <li><Link to="/experiences" className="hover:text-gold-300 transition-colors">Experiences</Link></li>
              <li><Link to="/gallery" className="hover:text-gold-300 transition-colors">Gallery</Link></li>
              <li><Link to="/restaurant" className="hover:text-gold-300 transition-colors">Restaurant</Link></li>
              <li><Link to="/wedding" className="hover:text-gold-300 transition-colors">Weddings</Link></li>
              <li><Link to="/booking" className="hover:text-gold-300 transition-colors">Book Now</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-sans uppercase tracking-[0.2em] text-gold-400 mb-5">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-gold-400 mt-0.5 shrink-0" />
                <span className="text-ivory/60">{CONTACT.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-gold-400 shrink-0" />
                <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`} className="hover:text-gold-300 transition-colors">{CONTACT.phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-gold-400 shrink-0" />
                <a href={`mailto:${CONTACT.email}`} className="hover:text-gold-300 transition-colors">{CONTACT.email}</a>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={16} className="text-gold-400 mt-0.5 shrink-0" />
                <span className="text-ivory/60">{CONTACT.hours}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Social */}
          <div>
            <h4 className="text-xs font-sans uppercase tracking-[0.2em] text-gold-400 mb-5">Stay Connected</h4>
            <p className="text-sm text-ivory/60 mb-4">Follow us for desert stories and exclusive offers.</p>
            <div className="flex gap-3 mb-6">
              <a href={CONTACT.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-ivory/20 flex items-center justify-center hover:bg-gold-400 hover:border-gold-400 transition-all">
                <Instagram size={18} />
              </a>
              <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-ivory/20 flex items-center justify-center hover:bg-gold-400 hover:border-gold-400 transition-all">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.47 14.38c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.67-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z"/><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.75 1.21h.04c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01C17.18 3.03 14.69 2 12.04 2z"/></svg>
              </a>
            </div>
            <Link to="/booking" className="btn-gold w-full">Book Your Stay</Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-ivory/10">
        <div className="container-luxury py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-ivory/40">
          <p>© {new Date().getFullYear()} The Dara Jaisalmer. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-gold-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gold-300 transition-colors">Terms</Link>
            <Link to="/refund" className="hover:text-gold-300 transition-colors">Refund Policy</Link>
            <Link to="/admin" className="hover:text-gold-300 transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
