import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarCheck, LogIn, LogOut, Clock, CheckCircle, XCircle,
  BedDouble, DollarSign, CreditCard, Compass, Mail, TrendingUp
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAdminAuth } from '@/lib/admin-auth';

interface Stats {
  totalBookings: number;
  todayCheckins: number;
  todayCheckouts: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  availableRooms: number;
  occupiedRooms: number;
  totalRevenue: number;
  pendingPayments: number;
  experienceBookings: number;
  newEnquiries: number;
}

export default function AdminDashboard() {
  const { profile } = useAdminAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<{ month: string; value: number }[]>([]);
  const [bookingTrends, setBookingTrends] = useState<{ label: string; value: number }[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<{ label: string; value: number; color: string }[]>([]);

  const loadDashboard = useCallback(async () => {
    const today = new Date().toISOString().split('T')[0];

    const [bookingsRes, contactsRes, roomsRes] = await Promise.all([
      supabase.from('bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('contact_messages').select('id, status').eq('status', 'new'),
      supabase.from('room_types').select('id, is_available'),
    ]);

    const bookings = bookingsRes.data || [];
    const contacts = contactsRes.data || [];
    const rooms = roomsRes.data || [];

    const totalRevenue = bookings
      .filter((b) => b.payment_status === 'paid')
      .reduce((sum, b) => sum + Number(b.grand_total || 0), 0);

    const pendingPayments = bookings
      .filter((b) => b.payment_status === 'pending')
      .reduce((sum, b) => sum + Number(b.grand_total || 0), 0);

    setStats({
      totalBookings: bookings.length,
      todayCheckins: bookings.filter((b) => b.check_in === today).length,
      todayCheckouts: bookings.filter((b) => b.check_out === today).length,
      pending: bookings.filter((b) => b.status === 'pending').length,
      confirmed: bookings.filter((b) => b.status === 'confirmed').length,
      cancelled: bookings.filter((b) => b.status === 'cancelled').length,
      availableRooms: rooms.filter((r) => r.is_available).length,
      occupiedRooms: rooms.filter((r) => !r.is_available).length,
      totalRevenue,
      pendingPayments,
      experienceBookings: bookings.filter((b) => b.experience && b.experience !== '').length,
      newEnquiries: contacts.length,
    });

    setRecentBookings(bookings.slice(0, 6));

    // Monthly revenue chart - last 6 months
    const months: { month: string; value: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = d.toISOString().slice(0, 7);
      const label = d.toLocaleString('default', { month: 'short' });
      const value = bookings
        .filter((b) => b.created_at?.slice(0, 7) === key && b.payment_status === 'paid')
        .reduce((sum, b) => sum + Number(b.grand_total || 0), 0);
      months.push({ month: label, value });
    }
    setMonthlyRevenue(months);

    // Booking trends - last 7 days
    const trends: { label: string; value: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const label = d.toLocaleString('default', { weekday: 'short' });
      const value = bookings.filter((b) => b.created_at?.slice(0, 10) === key).length;
      trends.push({ label, value });
    }
    setBookingTrends(trends);

    // Payment status breakdown
    const paid = bookings.filter((b) => b.payment_status === 'paid').length;
    const pendingP = bookings.filter((b) => b.payment_status === 'pending').length;
    const failed = bookings.filter((b) => b.payment_status === 'failed').length;
    const refunded = bookings.filter((b) => b.payment_status === 'refunded').length;
    setPaymentStatus([
      { label: 'Paid', value: paid, color: '#3b9b6e' },
      { label: 'Pending', value: pendingP, color: '#c9a55c' },
      { label: 'Failed', value: failed, color: '#e54d4d' },
      { label: 'Refunded', value: refunded, color: '#9ca3af' },
    ]);
  }, []);

  useEffect(() => { loadDashboard(); }, [loadDashboard]);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const cards = [
    { label: 'Total Bookings', value: stats.totalBookings, icon: CalendarCheck, color: 'text-gold-600' },
    { label: "Today's Check-ins", value: stats.todayCheckins, icon: LogIn, color: 'text-olive-600' },
    { label: "Today's Check-outs", value: stats.todayCheckouts, icon: LogOut, color: 'text-blue-600' },
    { label: 'Pending Bookings', value: stats.pending, icon: Clock, color: 'text-amber-600' },
    { label: 'Confirmed Bookings', value: stats.confirmed, icon: CheckCircle, color: 'text-olive-600' },
    { label: 'Cancelled Bookings', value: stats.cancelled, icon: XCircle, color: 'text-red-500' },
    { label: 'Available Rooms', value: stats.availableRooms, icon: BedDouble, color: 'text-olive-600' },
    { label: 'Occupied Rooms', value: stats.occupiedRooms, icon: BedDouble, color: 'text-red-500' },
    { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-olive-600' },
    { label: 'Pending Payments', value: `₹${stats.pendingPayments.toLocaleString()}`, icon: CreditCard, color: 'text-amber-600' },
    { label: 'Experience Bookings', value: stats.experienceBookings, icon: Compass, color: 'text-gold-600' },
    { label: 'New Enquiries', value: stats.newEnquiries, icon: Mail, color: 'text-blue-600' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-charcoal">
          Welcome back, {profile?.full_name.split(' ')[0]}
        </h1>
        <p className="text-sm text-charcoal/50 mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="card-luxury p-5">
            <div className="flex items-center justify-between mb-2">
              <card.icon size={20} className={card.color} />
            </div>
            <p className="text-2xl font-serif text-charcoal">{card.value}</p>
            <p className="text-xs text-charcoal/50 mt-1 uppercase tracking-[0.05em]">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Revenue */}
        <div className="card-luxury p-6">
          <h3 className="font-serif text-lg text-charcoal mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-gold-500" /> Monthly Revenue
          </h3>
          <BarChart data={monthlyRevenue.map((m) => ({ label: m.month, value: m.value }))} color="#c9a55c" />
        </div>

        {/* Booking Trends */}
        <div className="card-luxury p-6">
          <h3 className="font-serif text-lg text-charcoal mb-4 flex items-center gap-2">
            <CalendarCheck size={18} className="text-gold-500" /> Booking Trends (7 days)
          </h3>
          <BarChart data={bookingTrends} color="#3b9b6e" />
        </div>

        {/* Payment Status - Donut */}
        <div className="card-luxury p-6">
          <h3 className="font-serif text-lg text-charcoal mb-4 flex items-center gap-2">
            <CreditCard size={18} className="text-gold-500" /> Payment Status
          </h3>
          <DonutChart data={paymentStatus} />
        </div>

        {/* Room Occupancy */}
        <div className="card-luxury p-6">
          <h3 className="font-serif text-lg text-charcoal mb-4 flex items-center gap-2">
            <BedDouble size={18} className="text-gold-500" /> Room Occupancy
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-charcoal/60">Available</span>
                <span className="text-olive-600 font-medium">{stats.availableRooms} rooms</span>
              </div>
              <div className="h-3 bg-gold-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-olive-500 rounded-full transition-all"
                  style={{ width: `${(stats.availableRooms / (stats.availableRooms + stats.occupiedRooms || 1)) * 100}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-charcoal/60">Occupied</span>
                <span className="text-red-500 font-medium">{stats.occupiedRooms} rooms</span>
              </div>
              <div className="h-3 bg-gold-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full transition-all"
                  style={{ width: `${(stats.occupiedRooms / (stats.availableRooms + stats.occupiedRooms || 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="card-luxury p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif text-lg text-charcoal">Recent Bookings</h3>
          <Link to="/admin/bookings" className="text-sm text-gold-600 hover:text-gold-700">View All →</Link>
        </div>
        {recentBookings.length === 0 ? (
          <p className="text-sm text-charcoal/50 text-center py-8">
            No bookings yet. New bookings from the website will appear here automatically.
          </p>
        ) : (
          <div className="space-y-3">
            {recentBookings.map((b) => (
              <div key={b.id} className="flex items-center justify-between p-3 bg-gold-50 rounded-xl">
                <div>
                  <p className="font-medium text-charcoal">{b.guest_name}</p>
                  <p className="text-xs text-charcoal/50">{b.room_type || b.experience || 'Inquiry'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gold-600">₹{Number(b.grand_total).toLocaleString()}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gold-100 text-gold-700">{b.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BarChart({ data, color }: { data: { label: string; value: number }[]; color: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end justify-between gap-2 h-40">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2">
          <div className="w-full flex-1 flex items-end">
            <div
              className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80"
              style={{
                height: `${(d.value / max) * 100}%`,
                backgroundColor: color,
                minHeight: d.value > 0 ? '4px' : '0',
              }}
              title={`${d.label}: ${d.value}`}
            />
          </div>
          <span className="text-xs text-charcoal/50">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  if (total === 0) {
    return <p className="text-sm text-charcoal/50 text-center py-12">No payment data yet</p>;
  }
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;
  return (
    <div className="flex items-center gap-6">
      <svg width="160" height="160" viewBox="0 0 160 160">
        {data.map((d, i) => {
          const dash = (d.value / total) * circumference;
          const circle = (
            <circle
              key={i}
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke={d.color}
              strokeWidth="20"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 80 80)"
            />
          );
          offset += dash;
          return circle;
        })}
        <text x="80" y="75" textAnchor="middle" className="font-serif text-xl fill-charcoal">{total}</text>
        <text x="80" y="95" textAnchor="middle" className="text-xs fill-charcoal/50">Total</text>
      </svg>
      <div className="space-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-charcoal/60">{d.label}</span>
            <span className="text-charcoal font-medium">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
