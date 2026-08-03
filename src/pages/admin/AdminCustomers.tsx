import { useState, useEffect, useCallback } from 'react';
import { Search, Pencil, X, Download } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { exportCSV } from '@/lib/export-utils';
import type { Customer } from '@/lib/admin-types';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [form, setForm] = useState<Partial<Customer>>({});

  const load = useCallback(async () => {
    setLoading(true);
    const [custRes, bookRes] = await Promise.all([
      supabase.from('customers').select('*').order('created_at', { ascending: false }),
      supabase.from('bookings').select('id, email, guest_name, grand_total, check_in, payment_status'),
    ]);
    setCustomers((custRes.data || []) as Customer[]);
    setBookings(bookRes.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const getCustomerStats = (email: string) => {
    const custBookings = bookings.filter((b) => b.email === email);
    const totalSpent = custBookings
      .filter((b) => b.payment_status === 'paid')
      .reduce((sum, b) => sum + Number(b.grand_total || 0), 0);
    const lastVisit = custBookings
      .map((b) => b.check_in)
      .filter(Boolean)
      .sort()
      .pop();
    return { totalBookings: custBookings.length, totalSpent, lastVisit };
  };

  const filtered = customers.filter((c) =>
    !search ||
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  );

  const saveCustomer = async () => {
    if (editCustomer) {
      await supabase.from('customers').update(form).eq('id', editCustomer.id);
    } else {
      await supabase.from('customers').insert(form);
    }
    setEditCustomer(null);
    setForm({});
    load();
  };

  const handleExport = () => {
    const headers = ['Name', 'Phone', 'Email', 'Address', 'Total Bookings', 'Total Spent', 'Last Visit'];
    const rows = filtered.map((c) => {
      const stats = getCustomerStats(c.email);
      return [c.name, c.phone, c.email, c.address, stats.totalBookings, `₹${stats.totalSpent}`, stats.lastVisit || ''];
    });
    exportCSV('customers', headers, rows);
  };

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
        <h1 className="font-serif text-3xl text-charcoal">Customer Management</h1>
        <button onClick={handleExport} className="btn-outline !text-xs flex items-center gap-2 self-start">
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="input-luxury pl-11" placeholder="Search customers..." />
      </div>

      {filtered.length === 0 ? (
        <div className="card-luxury p-12 text-center">
          <p className="text-charcoal/50">No customers found. Customers from bookings and contact forms will appear here.</p>
        </div>
      ) : (
        <div className="card-luxury overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gold-50 text-charcoal/60 text-xs uppercase tracking-[0.05em]">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Total Bookings</th>
                <th className="p-3 text-left">Total Spent</th>
                <th className="p-3 text-left">Last Visit</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const stats = getCustomerStats(c.email);
                return (
                  <tr key={c.id} className="border-t border-gold-50 hover:bg-gold-50/50">
                    <td className="p-3 text-charcoal font-medium">{c.name}</td>
                    <td className="p-3 text-charcoal/60">{c.phone || '—'}</td>
                    <td className="p-3 text-charcoal/60">{c.email}</td>
                    <td className="p-3 text-charcoal/60">{stats.totalBookings}</td>
                    <td className="p-3 text-gold-600">₹{stats.totalSpent.toLocaleString()}</td>
                    <td className="p-3 text-charcoal/60">{stats.lastVisit || '—'}</td>
                    <td className="p-3">
                      <button onClick={() => { setEditCustomer(c); setForm(c); }} className="p-1.5 hover:bg-gold-100 rounded-lg">
                        <Pencil size={15} className="text-charcoal/50" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {editCustomer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditCustomer(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gold-50">
              <h2 className="font-serif text-xl text-charcoal">Edit Customer</h2>
              <button onClick={() => setEditCustomer(null)} className="text-charcoal/40 hover:text-charcoal">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="label-luxury">Name</label>
                <input value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-luxury" />
              </div>
              <div>
                <label className="label-luxury">Phone</label>
                <input value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-luxury" />
              </div>
              <div>
                <label className="label-luxury">Email</label>
                <input value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-luxury" />
              </div>
              <div>
                <label className="label-luxury">Address</label>
                <textarea value={form.address || ''} onChange={(e) => setForm({ ...form, address: e.target.value })} rows={2} className="input-luxury resize-none" />
              </div>
              <div>
                <label className="label-luxury">Notes</label>
                <textarea value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="input-luxury resize-none" />
              </div>
              <button onClick={saveCustomer} className="btn-gold w-full">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
