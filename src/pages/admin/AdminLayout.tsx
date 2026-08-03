import { useState, useEffect, useCallback } from 'react';
import { Navigate, NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, CalendarCheck, BedDouble, Compass, CalendarDays,
  CreditCard, Users, Mail, Star, FileBarChart, Bell, Settings,
  LogOut, Menu, X, UserPlus, ChevronDown
} from 'lucide-react';
import { useAdminAuth } from '@/lib/admin-auth';
import { supabase } from '@/lib/supabase';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
  { to: '/admin/rooms', label: 'Rooms', icon: BedDouble },
  { to: '/admin/experiences', label: 'Experiences', icon: Compass },
  { to: '/admin/calendar', label: 'Calendar', icon: CalendarDays },
  { to: '/admin/payments', label: 'Payments', icon: CreditCard },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/enquiries', label: 'Enquiries', icon: Mail },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },
  { to: '/admin/reports', label: 'Reports', icon: FileBarChart },
  { to: '/admin/notifications', label: 'Notifications', icon: Bell },
  { to: '/admin/settings', label: 'Website', icon: Settings },
];

const SUPER_ADMIN_ITEMS = [
  { to: '/admin/create-host', label: 'Create Host', icon: UserPlus },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { session, profile, passkeyVerified, signOut, isSuperAdmin } = useAdminAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userMenu, setUserMenu] = useState(false);

  const fetchUnread = useCallback(async () => {
    const { count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false);
    setUnreadCount(count || 0);
  }, []);

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [fetchUnread]);

  if (!session || !profile || !passkeyVerified) {
    return <Navigate to="/admin/login" replace />;
  }

  const navItems = isSuperAdmin ? [...NAV_ITEMS, ...SUPER_ADMIN_ITEMS] : NAV_ITEMS;

  return (
    <div className="min-h-screen bg-gold-50 flex">
      {/* Sidebar - Desktop */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-charcoal text-ivory flex flex-col transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-ivory/10">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-full overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.2)] ring-1 ring-gold-200/40 shrink-0">
              <img
                src="/Gemini_Generated_Image_686qs5686qs5686q.png"
                alt="The Dara"
                className="h-full w-full object-cover scale-[1.35]"
              />
            </div>
            <div>
              <h2 className="font-serif text-lg leading-tight">The Dara</h2>
              <p className="text-xs text-ivory/40 uppercase tracking-[0.15em]">Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-sans transition-colors ${
                  isActive
                    ? 'bg-gold-400 text-white'
                    : 'text-ivory/60 hover:bg-ivory/10 hover:text-ivory'
                }`
              }
            >
              <item.icon size={18} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.label === 'Notifications' && unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {unreadCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-ivory/10">
          <div className="relative">
            <button
              onClick={() => setUserMenu(!userMenu)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-ivory/60 hover:bg-ivory/10 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gold-400/20 flex items-center justify-center text-gold-300 text-xs font-medium shrink-0">
                {profile.full_name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-ivory truncate">{profile.full_name}</p>
                <p className="text-xs text-ivory/40 capitalize">{profile.role.replace('_', ' ')}</p>
              </div>
              <ChevronDown size={14} className={`transition-transform ${userMenu ? 'rotate-180' : ''}`} />
            </button>
            {userMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-charcoal border border-ivory/10 rounded-xl overflow-hidden shadow-xl">
                <button
                  onClick={() => { signOut(); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar - mobile */}
        <header className="lg:hidden bg-charcoal text-ivory px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <span className="font-serif text-lg">The Dara Admin</span>
          <button onClick={() => signOut()}>
            <LogOut size={20} />
          </button>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
