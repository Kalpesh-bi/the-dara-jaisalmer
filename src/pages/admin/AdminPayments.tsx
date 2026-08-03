import { useState, useEffect, useCallback } from 'react';
import { Download, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { exportCSV } from '@/lib/export-utils';

export default function AdminPayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const loadPayments = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    setPayments(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadPayments(); }, [loadPayments]);

  const filtered = payments.filter((p) => {
    const matchFilter = filter === 'all' || p.payment_status === filter;
    const matchSearch = !search ||
      p.guest_name?.toLowerCase().includes(search.toLowerCase()) ||
      p.id?.slice(0, 8).toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleExport = () => {
    const headers = ['Booking ID', 'Customer', 'Razorpay Payment ID', 'Transaction ID', 'Payment Method', 'Amount', 'GST', 'Discount', 'Final Amount', 'Payment Status', 'Refund Status', 'Date'];
    const rows = filtered.map((p) => [
      p.id.slice(0, 8), p.guest_name, p.razorpay_payment_id || '', p.transaction_id || '',
      p.payment_method || '', p.estimated_price, p.taxes, p.discount, p.grand_total,
      p.payment_status, p.refund_status, new Date(p.created_at).toLocaleDateString(),
    ]);
    exportCSV('payments', headers, rows);
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
        <h1 className="font-serif text-3xl text-charcoal">Payment Management</h1>
        <button onClick={handleExport} className="btn-outline !text-xs flex items-center gap-2 self-start">
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="input-luxury pl-11" placeholder="Search by customer or booking ID..." />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input-luxury sm:w-40">
          <option value="all">All</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="card-luxury p-12 text-center">
          <p className="text-charcoal/50">No payments found.</p>
        </div>
      ) : (
        <div className="card-luxury overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gold-50 text-charcoal/60 text-xs uppercase tracking-[0.05em]">
              <tr>
                <th className="p-3 text-left">Booking ID</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Razorpay ID</th>
                <th className="p-3 text-left">Transaction ID</th>
                <th className="p-3 text-left">Method</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">GST</th>
                <th className="p-3 text-left">Discount</th>
                <th className="p-3 text-left">Final</th>
                <th className="p-3 text-left">Pay Status</th>
                <th className="p-3 text-left">Refund</th>
                <th className="p-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-t border-gold-50 hover:bg-gold-50/50">
                  <td className="p-3 font-mono text-xs text-charcoal">{p.id.slice(0, 8).toUpperCase()}</td>
                  <td className="p-3 text-charcoal">{p.guest_name}</td>
                  <td className="p-3 text-xs text-charcoal/50">{p.razorpay_payment_id || '—'}</td>
                  <td className="p-3 text-xs text-charcoal/50">{p.transaction_id || '—'}</td>
                  <td className="p-3 text-charcoal/60">{p.payment_method || '—'}</td>
                  <td className="p-3 text-charcoal">₹{Number(p.estimated_price).toLocaleString()}</td>
                  <td className="p-3 text-charcoal/60">₹{Number(p.taxes).toLocaleString()}</td>
                  <td className="p-3 text-charcoal/60">₹{Number(p.discount).toLocaleString()}</td>
                  <td className="p-3 text-gold-600 font-medium">₹{Number(p.grand_total).toLocaleString()}</td>
                  <td className="p-3"><StatusBadge status={p.payment_status} /></td>
                  <td className="p-3"><StatusBadge status={p.refund_status} /></td>
                  <td className="p-3 text-xs text-charcoal/50">{new Date(p.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    paid: 'bg-olive-100 text-olive-700',
    pending: 'bg-amber-100 text-amber-700',
    failed: 'bg-red-100 text-red-700',
    refunded: 'bg-gray-100 text-gray-700',
    none: 'bg-gray-100 text-gray-600',
  };
  return <span className={`text-xs px-2 py-1 rounded-full capitalize ${colors[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>;
}
