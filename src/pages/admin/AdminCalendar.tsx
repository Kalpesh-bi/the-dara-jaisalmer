import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Holiday } from '@/lib/admin-types';

const COLOR_LEGEND = [
  { color: 'bg-olive-500', label: 'Available' },
  { color: 'bg-amber-400', label: 'Reserved' },
  { color: 'bg-red-500', label: 'Booked' },
  { color: 'bg-gray-400', label: 'Maintenance' },
];

export default function AdminCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<any[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [holidayForm, setHolidayForm] = useState({ title: '', description: '', date: '', type: 'holiday' });

  const loadData = useCallback(async () => {
    const [bookingsRes, holidaysRes] = await Promise.all([
      supabase.from('bookings').select('id, guest_name, check_in, check_out, room_type, experience, status'),
      supabase.from('holidays').select('*').order('date', { ascending: true }),
    ]);
    setBookings(bookingsRes.data || []);
    setHolidays((holidaysRes.data || []) as Holiday[]);
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const getDayStatus = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayBookings = bookings.filter((b) => {
      return b.check_in === dateStr || b.check_out === dateStr ||
        (b.check_in && b.check_out && dateStr >= b.check_in && dateStr <= b.check_out);
    });
    const holiday = holidays.find((h) => h.date === dateStr);
    return { dayBookings, holiday };
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const addHoliday = async () => {
    if (!holidayForm.title || !holidayForm.date) return;
    await supabase.from('holidays').insert(holidayForm);
    setShowHolidayModal(false);
    setHolidayForm({ title: '', description: '', date: '', type: 'holiday' });
    loadData();
  };

  const cells: (number | null)[] = [];
  for (let i = 0; i < startDayOfWeek; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="font-serif text-3xl text-charcoal">Hotel Calendar</h1>
        <button onClick={() => setShowHolidayModal(true)} className="btn-gold flex items-center gap-2 self-start">
          <Plus size={16} /> Add Holiday/Event
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6">
        {COLOR_LEGEND.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full ${item.color}`} />
            <span className="text-sm text-charcoal/60">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <div className="card-luxury p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={prevMonth} className="p-2 hover:bg-gold-50 rounded-lg">
            <ChevronLeft size={20} className="text-charcoal/60" />
          </button>
          <h2 className="font-serif text-xl text-charcoal">{monthName} {year}</h2>
          <button onClick={nextMonth} className="p-2 hover:bg-gold-50 rounded-lg">
            <ChevronRight size={20} className="text-charcoal/60" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 md:gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="text-center text-xs font-medium text-charcoal/40 uppercase tracking-wide py-2">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {cells.map((day, i) => {
            if (day === null) return <div key={i} />;
            const { dayBookings, holiday } = getDayStatus(day);
            const hasConfirmed = dayBookings.some((b) => b.status === 'confirmed');
            const hasPending = dayBookings.some((b) => b.status === 'pending');
            const bgClass = holiday
              ? 'bg-gray-100 border-gray-300'
              : hasConfirmed
              ? 'bg-red-50 border-red-200'
              : hasPending
              ? 'bg-amber-50 border-amber-200'
              : 'bg-olive-50 border-olive-200';

            return (
              <div
                key={i}
                className={`min-h-[60px] md:min-h-[80px] p-1.5 rounded-lg border ${bgClass} transition-colors hover:shadow-sm cursor-default`}
              >
                <span className="text-xs font-medium text-charcoal/60">{day}</span>
                {holiday && (
                  <p className="text-xs text-charcoal/70 mt-1 truncate">{holiday.title}</p>
                )}
                {dayBookings.length > 0 && !holiday && (
                  <div className="mt-1 space-y-0.5">
                    {dayBookings.slice(0, 2).map((b) => (
                      <p key={b.id} className="text-xs text-charcoal/50 truncate">
                        {b.guest_name}
                      </p>
                    ))}
                    {dayBookings.length > 2 && (
                      <p className="text-xs text-charcoal/40">+{dayBookings.length - 2} more</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Holidays/Events */}
      <div className="mt-6 card-luxury p-6">
        <h3 className="font-serif text-lg text-charcoal mb-4">Holidays & Events</h3>
        {holidays.length === 0 ? (
          <p className="text-sm text-charcoal/50">No holidays or events added yet.</p>
        ) : (
          <div className="space-y-2">
            {holidays.map((h) => (
              <div key={h.id} className="flex items-center justify-between p-3 bg-gold-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-charcoal">{h.title}</p>
                  {h.description && <p className="text-xs text-charcoal/50">{h.description}</p>}
                </div>
                <span className="text-sm text-gold-600">{new Date(h.date).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Holiday Modal */}
      {showHolidayModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowHolidayModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gold-50">
              <h2 className="font-serif text-xl text-charcoal">Add Holiday/Event</h2>
              <button onClick={() => setShowHolidayModal(false)} className="text-charcoal/40 hover:text-charcoal">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="label-luxury">Title</label>
                <input value={holidayForm.title} onChange={(e) => setHolidayForm({ ...holidayForm, title: e.target.value })} className="input-luxury" placeholder="Diwali" />
              </div>
              <div>
                <label className="label-luxury">Date</label>
                <input type="date" value={holidayForm.date} onChange={(e) => setHolidayForm({ ...holidayForm, date: e.target.value })} className="input-luxury" />
              </div>
              <div>
                <label className="label-luxury">Type</label>
                <select value={holidayForm.type} onChange={(e) => setHolidayForm({ ...holidayForm, type: e.target.value })} className="input-luxury">
                  <option value="holiday">Holiday</option>
                  <option value="event">Event</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              <div>
                <label className="label-luxury">Description</label>
                <textarea value={holidayForm.description} onChange={(e) => setHolidayForm({ ...holidayForm, description: e.target.value })} rows={2} className="input-luxury resize-none" />
              </div>
              <button onClick={addHoliday} className="btn-gold w-full">Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
