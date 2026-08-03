import { useState, useEffect, useCallback } from 'react';
import {
  Eye, Pencil, Check, X, RefreshCw, Printer, Download, Search, Filter, XCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { exportCSV } from '@/lib/export-utils';
import type { AdminBooking } from '@/lib/admin-types';

export default function AdminBookings() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selected, setSelected] = useState<AdminBooking | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState<Partial<AdminBooking>>({});

  const loadBookings = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    setBookings((data || []) as AdminBooking[]);
    setLoading(false);
  }, []);

  useEffect(() => { loadBookings(); }, [loadBookings]);

  const filtered = bookings.filter((b) => {
    const matchSearch = !search ||
      b.guest_name.toLowerCase().includes(search.toLowerCase()) ||
      b.email.toLowerCase().includes(search.toLowerCase()) ||
      b.phone.includes(search);
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    const matchPayment = paymentFilter === 'all' || b.payment_status === paymentFilter;
    return matchSearch && matchStatus && matchPayment;
  });

  const updateBooking = async (id: string, updates: Partial<AdminBooking>) => {
    const { error } = await supabase.from('bookings').update(updates).eq('id', id);
    if (!error) {
      await loadBookings();
      setSelected(null);
      setEditMode(false);
    }
  };

  const handleExport = () => {
    const headers = ['Booking ID', 'Customer', 'Phone', 'Email', 'Room/Experience', 'Check-in', 'Check-out', 'Guests', 'Days', 'Amount', 'GST', 'Discount', 'Payment Status', 'Booking Status', 'Created'];
    const rows = filtered.map((b) => [
      b.id.slice(0, 8),
      b.guest_name, b.phone, b.email,
      b.room_type || b.experience || '',
      b.check_in || '', b.check_out || '',
      b.adults + b.children,
      b.number_of_days,
      b.estimated_price, b.taxes, b.discount,
      b.payment_status, b.status,
      new Date(b.created_at).toLocaleDateString(),
    ]);
    exportCSV('bookings', headers, rows);
  };

  const printInvoice = (b: AdminBooking) => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>Invoice - ${b.guest_name}</title><style>
      body{font-family:Georgia,serif;padding:40px;color:#1a1a1a;max-width:600px;margin:0 auto}
      h1{color:#c9a55c;font-size:28px} .info{display:flex;justify-content:space-between;margin:20px 0}
      table{width:100%;border-collapse:collapse;margin:20px 0} td,th{padding:8px;border-bottom:1px solid #ddd}
      .total{font-size:20px;font-weight:bold;color:#c9a55c} @media print{button{display:none}}
    </style></head><body>
      <h1>The Dara Jaisalmer</h1>
      <p>Sam Road, Near Sam Sand Dunes, Jaisalmer, Rajasthan 345001</p>
      <hr>
      <h2>Invoice #${b.id.slice(0, 8).toUpperCase()}</h2>
      <div class="info">
        <div><p><strong>Customer:</strong> ${b.guest_name}</p><p><strong>Phone:</strong> ${b.phone}</p><p><strong>Email:</strong> ${b.email}</p></div>
        <div><p><strong>Check-in:</strong> ${b.check_in || 'N/A'}</p><p><strong>Check-out:</strong> ${b.check_out || 'N/A'}</p><p><strong>Guests:</strong> ${b.adults + b.children}</p></div>
      </div>
      <table><thead><tr><th>Description</th><th>Amount</th></tr></thead><tbody>
      <tr><td>${b.room_type || b.experience || 'Booking'} (${b.number_of_days} days)</td><td>₹${Number(b.estimated_price).toLocaleString()}</td></tr>
      <tr><td>GST</td><td>₹${Number(b.taxes).toLocaleString()}</td></tr>
      ${b.discount > 0 ? `<tr><td>Discount</td><td>-₹${Number(b.discount).toLocaleString()}</td></tr>` : ''}
      </tbody></table>
      <p class="total">Grand Total: ₹${Number(b.grand_total).toLocaleString()}</p>
      <p style="font-size:12px;color:#666;margin-top:30px">Payment Status: ${b.payment_status} | Booking Status: ${b.status}</p>
      <p style="font-size:12px;color:#666">Created: ${new Date(b.created_at).toLocaleString()}</p>
      <script>setTimeout(()=>window.print(),500)</script>
    </body></html>`);
    win.document.close();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="font-serif text-3xl text-charcoal">Booking Management</h1>
        <button onClick={handleExport} className="btn-outline !text-xs flex items-center gap-2 self-start">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-luxury pl-11"
            placeholder="Search by name, email, or phone..."
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-luxury sm:w-40">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
        <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)} className="input-luxury sm:w-40">
          <option value="all">All Payments</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-luxury p-12 text-center">
          <p className="text-charcoal/50">No bookings found. New bookings from the website will appear here automatically.</p>
        </div>
      ) : (
        <div className="card-luxury overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gold-50 text-charcoal/60 text-xs uppercase tracking-[0.05em]">
              <tr>
                <th className="p-3 text-left">Booking ID</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Room/Exp</th>
                <th className="p-3 text-left">Check-in</th>
                <th className="p-3 text-left">Check-out</th>
                <th className="p-3 text-left">Guests</th>
                <th className="p-3 text-left">Days</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Pay Status</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className="border-t border-gold-50 hover:bg-gold-50/50">
                  <td className="p-3 text-charcoal font-mono text-xs">{b.id.slice(0, 8).toUpperCase()}</td>
                  <td className="p-3">
                    <p className="text-charcoal font-medium">{b.guest_name}</p>
                    <p className="text-xs text-charcoal/40">{b.phone}</p>
                  </td>
                  <td className="p-3 text-charcoal/60">{b.room_type || b.experience || '—'}</td>
                  <td className="p-3 text-charcoal/60">{b.check_in || '—'}</td>
                  <td className="p-3 text-charcoal/60">{b.check_out || '—'}</td>
                  <td className="p-3 text-charcoal/60">{b.adults + b.children}</td>
                  <td className="p-3 text-charcoal/60">{b.number_of_days}</td>
                  <td className="p-3 text-gold-600 font-medium">₹{Number(b.grand_total).toLocaleString()}</td>
                  <td className="p-3">
                    <StatusBadge status={b.payment_status} />
                  </td>
                  <td className="p-3">
                    <StatusBadge status={b.status} />
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => { setSelected(b); setEditMode(false); }} className="p-1.5 hover:bg-gold-100 rounded-lg" title="View">
                        <Eye size={15} className="text-charcoal/50" />
                      </button>
                      <button onClick={() => { setSelected(b); setEditMode(true); setEditForm(b); }} className="p-1.5 hover:bg-gold-100 rounded-lg" title="Edit">
                        <Pencil size={15} className="text-charcoal/50" />
                      </button>
                      {b.status !== 'confirmed' && (
                        <button onClick={() => updateBooking(b.id, { status: 'confirmed' })} className="p-1.5 hover:bg-olive-100 rounded-lg" title="Confirm">
                          <Check size={15} className="text-olive-600" />
                        </button>
                      )}
                      {b.status !== 'cancelled' && (
                        <button onClick={() => updateBooking(b.id, { status: 'cancelled' })} className="p-1.5 hover:bg-red-50 rounded-lg" title="Cancel">
                          <X size={15} className="text-red-500" />
                        </button>
                      )}
                      {b.payment_status === 'paid' && b.refund_status === 'none' && (
                        <button onClick={() => updateBooking(b.id, { payment_status: 'refunded', refund_status: 'refunded' })} className="p-1.5 hover:bg-gold-100 rounded-lg" title="Refund">
                          <RefreshCw size={15} className="text-amber-600" />
                        </button>
                      )}
                      <button onClick={() => printInvoice(b)} className="p-1.5 hover:bg-gold-100 rounded-lg" title="Print Invoice">
                        <Printer size={15} className="text-charcoal/50" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setSelected(null); setEditMode(false); }}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gold-50">
              <h2 className="font-serif text-xl text-charcoal">
                {editMode ? 'Edit Booking' : 'Booking Details'}
              </h2>
              <button onClick={() => { setSelected(null); setEditMode(false); }} className="text-charcoal/40 hover:text-charcoal">
                <XCircle size={20} />
              </button>
            </div>
            {editMode ? (
              <div className="p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label-luxury">Guest Name</label>
                    <input value={editForm.guest_name || ''} onChange={(e) => setEditForm({ ...editForm, guest_name: e.target.value })} className="input-luxury" />
                  </div>
                  <div>
                    <label className="label-luxury">Email</label>
                    <input value={editForm.email || ''} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className="input-luxury" />
                  </div>
                  <div>
                    <label className="label-luxury">Phone</label>
                    <input value={editForm.phone || ''} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} className="input-luxury" />
                  </div>
                  <div>
                    <label className="label-luxury">Room Type</label>
                    <input value={editForm.room_type || ''} onChange={(e) => setEditForm({ ...editForm, room_type: e.target.value })} className="input-luxury" />
                  </div>
                  <div>
                    <label className="label-luxury">Check-in</label>
                    <input type="date" value={editForm.check_in || ''} onChange={(e) => setEditForm({ ...editForm, check_in: e.target.value })} className="input-luxury" />
                  </div>
                  <div>
                    <label className="label-luxury">Check-out</label>
                    <input type="date" value={editForm.check_out || ''} onChange={(e) => setEditForm({ ...editForm, check_out: e.target.value })} className="input-luxury" />
                  </div>
                  <div>
                    <label className="label-luxury">Booking Status</label>
                    <select value={editForm.status || ''} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} className="input-luxury">
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="label-luxury">Payment Status</label>
                    <select value={editForm.payment_status || ''} onChange={(e) => setEditForm({ ...editForm, payment_status: e.target.value })} className="input-luxury">
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                  <div>
                    <label className="label-luxury">Grand Total</label>
                    <input type="number" value={editForm.grand_total || 0} onChange={(e) => setEditForm({ ...editForm, grand_total: Number(e.target.value) })} className="input-luxury" />
                  </div>
                </div>
                <button onClick={() => updateBooking(selected.id, editForm)} className="btn-gold w-full">Save Changes</button>
              </div>
            ) : (
              <div className="p-6 space-y-3">
                <DetailRow label="Booking ID" value={selected.id.slice(0, 8).toUpperCase()} />
                <DetailRow label="Customer Name" value={selected.guest_name} />
                <DetailRow label="Phone" value={selected.phone} />
                <DetailRow label="Email" value={selected.email} />
                <DetailRow label="Room/Experience" value={selected.room_type || selected.experience || 'N/A'} />
                <DetailRow label="Check-in" value={selected.check_in || 'N/A'} />
                <DetailRow label="Check-out" value={selected.check_out || 'N/A'} />
                <DetailRow label="Guests" value={`${selected.adults} adults, ${selected.children} children`} />
                <DetailRow label="Pickup Required" value={selected.pickup_required ? `Yes (${selected.pickup_location || 'N/A'})` : 'No'} />
                <DetailRow label="Drop Required" value={selected.drop_required ? `Yes (${selected.drop_location || 'N/A'})` : 'No'} />
                <DetailRow label="Number of Days" value={String(selected.number_of_days)} />
                <DetailRow label="Amount" value={`₹${Number(selected.estimated_price).toLocaleString()}`} />
                <DetailRow label="GST" value={`₹${Number(selected.taxes).toLocaleString()}`} />
                <DetailRow label="Discount" value={`₹${Number(selected.discount).toLocaleString()}`} />
                <DetailRow label="Grand Total" value={`₹${Number(selected.grand_total).toLocaleString()}`} />
                <DetailRow label="Payment Status" value={selected.payment_status} />
                <DetailRow label="Booking Status" value={selected.status} />
                <DetailRow label="Created Date" value={new Date(selected.created_at).toLocaleString()} />
                {selected.special_request && <DetailRow label="Special Request" value={selected.special_request} />}
                <div className="flex gap-2 pt-4">
                  <button onClick={() => printInvoice(selected)} className="btn-outline flex-1 flex items-center justify-center gap-2">
                    <Printer size={16} /> Print Invoice
                  </button>
                  <button onClick={() => { setEditMode(true); setEditForm(selected); }} className="btn-gold flex-1 flex items-center justify-center gap-2">
                    <Pencil size={16} /> Edit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    confirmed: 'bg-olive-100 text-olive-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-blue-100 text-blue-700',
    paid: 'bg-olive-100 text-olive-700',
    failed: 'bg-red-100 text-red-700',
    refunded: 'bg-gray-100 text-gray-700',
    none: 'bg-gray-100 text-gray-600',
    new: 'bg-blue-100 text-blue-700',
    contacted: 'bg-amber-100 text-amber-700',
    closed: 'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`text-xs px-2 py-1 rounded-full capitalize ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-gold-50">
      <span className="text-sm text-charcoal/50">{label}</span>
      <span className="text-sm text-charcoal font-medium text-right">{value}</span>
    </div>
  );
}
