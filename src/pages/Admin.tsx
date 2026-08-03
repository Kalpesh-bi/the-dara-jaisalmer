import { useState, useEffect } from 'react';
import { Lock, LayoutDashboard, BedDouble, CalendarCheck, Compass, Image, Tag, Star, LogOut, Download } from 'lucide-react';
import { ROOMS, EXPERIENCES, REVIEWS, IMG } from '@/lib/data';
import { supabase } from '@/lib/supabase';

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState('dashboard');
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    if (loggedIn) {
      supabase.from('bookings').select('*').order('created_at', { ascending: false }).then(({ data }) => {
        if (data) setBookings(data);
      });
    }
  }, [loggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password.length >= 4) {
      setLoggedIn(true);
      setError('');
    } else {
      setError('Please enter valid credentials');
    }
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal px-5">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-gold mx-auto flex items-center justify-center mb-4">
              <Lock size={28} className="text-white" />
            </div>
            <h1 className="font-serif text-3xl text-ivory">Admin Login</h1>
            <p className="text-sm text-ivory/50 mt-2">The Dara Jaisalmer Management</p>
          </div>
          <form onSubmit={handleLogin} className="glass rounded-2xl p-8 space-y-4">
            <div>
              <label className="label-luxury">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-luxury" placeholder="admin@thedarajaisalmer.com" />
            </div>
            <div>
              <label className="label-luxury">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-luxury" placeholder="••••••••" />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button type="submit" className="btn-gold w-full">Login</button>
          </form>
        </div>
      </div>
    );
  }

  const TABS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'rooms', label: 'Rooms', icon: BedDouble },
    { id: 'bookings', label: 'Bookings', icon: CalendarCheck },
    { id: 'experiences', label: 'Experiences', icon: Compass },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'coupons', label: 'Coupons', icon: Tag },
    { id: 'reviews', label: 'Reviews', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-gold-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-charcoal text-ivory p-6 hidden md:flex flex-col">
        <h2 className="font-serif text-xl mb-8">The Dara Admin</h2>
        <nav className="space-y-1 flex-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-sans transition-colors ${
                tab === t.id ? 'bg-gold-400 text-white' : 'text-ivory/60 hover:bg-ivory/10'
              }`}
            >
              <t.icon size={18} /> {t.label}
            </button>
          ))}
        </nav>
        <button onClick={() => setLoggedIn(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-ivory/60 hover:text-red-400 transition-colors">
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Mobile tabs */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-charcoal z-50 flex overflow-x-auto scrollbar-hide">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-3 text-xs whitespace-nowrap transition-colors ${tab === t.id ? 'text-gold-300 border-b-2 border-gold-300' : 'text-ivory/50'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <main className="flex-1 p-6 md:p-10 mt-12 md:mt-0 overflow-y-auto">
        {tab === 'dashboard' && (
          <div>
            <h1 className="font-serif text-3xl text-charcoal mb-8">Dashboard</h1>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard label="Total Bookings" value={bookings.length} />
              <StatCard label="Pending" value={bookings.filter(b => b.status === 'pending').length} />
              <StatCard label="Rooms" value={ROOMS.length} />
              <StatCard label="Experiences" value={EXPERIENCES.length} />
            </div>
            <div className="mt-8 card-luxury p-6">
              <h3 className="font-serif text-xl text-charcoal mb-4">Recent Bookings</h3>
              {bookings.length === 0 ? (
                <p className="text-sm text-charcoal/50">No bookings yet. New bookings from the website will appear here.</p>
              ) : (
                <div className="space-y-3">
                  {bookings.slice(0, 5).map((b) => (
                    <div key={b.id} className="flex items-center justify-between p-3 bg-gold-50 rounded-xl">
                      <div>
                        <p className="font-medium text-charcoal">{b.guest_name}</p>
                        <p className="text-xs text-charcoal/50">{b.room_type || b.experience || 'Inquiry'}</p>
                      </div>
                      <span className="text-sm text-gold-600">₹{Number(b.grand_total).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'rooms' && (
          <div>
            <h1 className="font-serif text-3xl text-charcoal mb-8">Manage Rooms</h1>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ROOMS.map((r) => (
                <div key={r.id} className="card-luxury overflow-hidden">
                  <img src={r.image_url} alt={r.name} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <h3 className="font-serif text-lg text-charcoal">{r.name}</h3>
                    <p className="text-sm text-gold-600">₹{r.price.toLocaleString()}/night</p>
                    <p className="text-xs text-charcoal/50 mt-1">{r.is_available ? 'Available' : 'Booked'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'bookings' && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h1 className="font-serif text-3xl text-charcoal">Bookings</h1>
              <button onClick={() => exportBookings(bookings)} className="btn-outline !text-xs">
                <Download size={14} /> Export Excel
              </button>
            </div>
            {bookings.length === 0 ? (
              <div className="card-luxury p-12 text-center">
                <CalendarCheck size={48} className="text-gold-300 mx-auto mb-4" />
                <p className="text-charcoal/50">No bookings yet. New bookings will appear here automatically.</p>
              </div>
            ) : (
              <div className="card-luxury overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gold-50 text-charcoal/60 text-xs uppercase tracking-[0.1em]">
                    <tr>
                      <th className="p-4 text-left">Guest</th>
                      <th className="p-4 text-left">Room/Experience</th>
                      <th className="p-4 text-left">Check-in</th>
                      <th className="p-4 text-left">Total</th>
                      <th className="p-4 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.id} className="border-t border-gold-50">
                        <td className="p-4 text-charcoal">{b.guest_name}</td>
                        <td className="p-4 text-charcoal/60">{b.room_type || b.experience || '—'}</td>
                        <td className="p-4 text-charcoal/60">{b.check_in || '—'}</td>
                        <td className="p-4 text-gold-600">₹{Number(b.grand_total).toLocaleString()}</td>
                        <td className="p-4"><span className="text-xs px-2 py-1 rounded-full bg-gold-100 text-gold-700">{b.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === 'experiences' && (
          <div>
            <h1 className="font-serif text-3xl text-charcoal mb-8">Manage Experiences</h1>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {EXPERIENCES.map((e) => (
                <div key={e.id} className="card-luxury overflow-hidden">
                  <img src={e.image_url} alt={e.title} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <h3 className="font-serif text-lg text-charcoal">{e.title}</h3>
                    <p className="text-sm text-gold-600">₹{e.price.toLocaleString()}/person</p>
                    <p className="text-xs text-charcoal/50 mt-1">{e.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'gallery' && (
          <div>
            <h1 className="font-serif text-3xl text-charcoal mb-8">Manage Gallery</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[IMG.dunes1, IMG.camel2, IMG.camp3, IMG.fort1, IMG.wedding1, IMG.food1, IMG.cultural1, IMG.room1].map((img, i) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden">
                  <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'coupons' && (
          <div>
            <h1 className="font-serif text-3xl text-charcoal mb-8">Manage Coupons</h1>
            <div className="card-luxury p-6">
              <p className="text-sm text-charcoal/50">Coupon management will be available here. Create discount codes for seasonal promotions and special offers.</p>
            </div>
          </div>
        )}

        {tab === 'reviews' && (
          <div>
            <h1 className="font-serif text-3xl text-charcoal mb-8">Manage Reviews</h1>
            <div className="space-y-4">
              {REVIEWS.map((r) => (
                <div key={r.id} className="card-luxury p-6 flex items-start justify-between">
                  <div>
                    <p className="font-serif text-lg text-charcoal">{r.title}</p>
                    <p className="text-sm text-charcoal/60 mt-1">{r.body}</p>
                    <p className="text-xs text-gold-600 mt-2">— {r.guest_name}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-olive-100 text-olive-600">Approved</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="card-luxury p-6">
      <p className="text-3xl font-serif text-gold-600">{value}</p>
      <p className="text-xs text-charcoal/50 mt-1 uppercase tracking-[0.1em]">{label}</p>
    </div>
  );
}

function exportBookings(bookings: any[]) {
  if (bookings.length === 0) return;
  const headers = ['Guest Name', 'Email', 'Phone', 'Room Type', 'Experience', 'Check-in', 'Check-out', 'Total', 'Status'];
  const rows = bookings.map(b => [b.guest_name, b.email, b.phone, b.room_type || '', b.experience || '', b.check_in || '', b.check_out || '', b.grand_total, b.status]);
  const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'bookings.csv';
  a.click();
  URL.revokeObjectURL(url);
}
