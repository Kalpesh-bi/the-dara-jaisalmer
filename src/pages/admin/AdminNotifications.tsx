import { useState, useEffect, useCallback } from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { AdminNotification } from '@/lib/admin-types';

const ICONS: Record<string, string> = {
  new_booking: 'bg-olive-100 text-olive-600',
  payment_success: 'bg-olive-100 text-olive-600',
  payment_failure: 'bg-red-100 text-red-600',
  cancellation: 'bg-red-100 text-red-600',
  contact_form: 'bg-blue-100 text-blue-600',
  review_submitted: 'bg-gold-100 text-gold-600',
};

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
    setNotifications((data || []) as AdminNotification[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const markRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    load();
  };

  const markAllRead = async () => {
    await supabase.from('notifications').update({ is_read: true }).neq('is_read', true);
    load();
  };

  const remove = async (id: string) => {
    await supabase.from('notifications').delete().eq('id', id);
    load();
  };

  const filtered = notifications.filter((n) => filter === 'all' || (filter === 'unread' && !n.is_read));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="font-serif text-3xl text-charcoal">Notifications</h1>
        <button onClick={markAllRead} className="btn-outline !text-xs flex items-center gap-2 self-start">
          <Check size={14} /> Mark All Read
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {['all', 'unread'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm capitalize transition-colors ${filter === f ? 'bg-gold-400 text-white' : 'bg-white text-charcoal/60 hover:bg-gold-50'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card-luxury p-12 text-center">
          <Bell size={40} className="text-gold-300 mx-auto mb-4" />
          <p className="text-charcoal/50">No notifications. You'll see real-time alerts for new bookings, payments, cancellations, enquiries, and reviews here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((n) => (
            <div
              key={n.id}
              className={`card-luxury p-4 flex items-start gap-4 ${!n.is_read ? 'border-l-4 border-l-gold-400' : ''}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${ICONS[n.type] || 'bg-gray-100 text-gray-600'}`}>
                <Bell size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-charcoal">{n.title}</p>
                <p className="text-sm text-charcoal/50">{n.message}</p>
                <p className="text-xs text-charcoal/40 mt-1">{new Date(n.created_at).toLocaleString()}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                {!n.is_read && (
                  <button onClick={() => markRead(n.id)} className="p-1.5 hover:bg-olive-100 rounded-lg" title="Mark Read">
                    <Check size={15} className="text-olive-600" />
                  </button>
                )}
                <button onClick={() => remove(n.id)} className="p-1.5 hover:bg-red-50 rounded-lg" title="Delete">
                  <Trash2 size={15} className="text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
