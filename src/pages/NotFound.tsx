import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal px-5">
      <div className="text-center max-w-md">
        <p className="font-serif text-[120px] leading-none text-gold-400">404</p>
        <h1 className="font-serif text-3xl text-ivory mt-4 mb-3">Page Not Found</h1>
        <p className="text-ivory/60 mb-8">
          It seems you've wandered off the desert path. Let us guide you back.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn-gold"><Home size={16} /> Back Home</Link>
          <Link to="/experiences" className="btn-outline !border-ivory/40 !text-ivory hover:!bg-ivory/10">
            <Compass size={16} /> Explore Experiences
          </Link>
        </div>
      </div>
    </div>
  );
}
