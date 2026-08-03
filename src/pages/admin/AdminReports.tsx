import { useState, useEffect, useCallback } from 'react';
import { FileBarChart, Download, FileText, FileSpreadsheet, Printer } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { exportCSV, exportExcel, exportPDF } from '@/lib/export-utils';

type ReportType = 'daily' | 'monthly' | 'yearly' | 'booking' | 'occupancy' | 'experience' | 'payment' | 'gst';

const REPORTS: { id: ReportType; label: string }[] = [
  { id: 'daily', label: 'Daily Revenue' },
  { id: 'monthly', label: 'Monthly Revenue' },
  { id: 'yearly', label: 'Yearly Revenue' },
  { id: 'booking', label: 'Booking Report' },
  { id: 'occupancy', label: 'Occupancy Report' },
  { id: 'experience', label: 'Experience Report' },
  { id: 'payment', label: 'Payment Report' },
  { id: 'gst', label: 'GST Report' },
];

export default function AdminReports() {
  const [selected, setSelected] = useState<ReportType>('monthly');
  const [data, setData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const generateReport = useCallback(async (type: ReportType) => {
    setLoading(true);
    const { data: bookings } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
    const { data: rooms } = await supabase.from('room_types').select('*');
    const books = bookings || [];

    let rows: any[][] = [];
    let hdrs: string[] = [];

    if (type === 'daily') {
      hdrs = ['Date', 'Bookings', 'Revenue', 'GST Collected'];
      const map = new Map<string, { count: number; revenue: number; gst: number }>();
      books.forEach((b) => {
        const date = (b.created_at || '').slice(0, 10);
        if (!date) return;
        const entry = map.get(date) || { count: 0, revenue: 0, gst: 0 };
        entry.count++;
        if (b.payment_status === 'paid') {
          entry.revenue += Number(b.grand_total || 0);
          entry.gst += Number(b.taxes || 0);
        }
        map.set(date, entry);
      });
      rows = Array.from(map.entries()).map(([date, v]) => [date, v.count, `₹${v.revenue.toLocaleString()}`, `₹${v.gst.toLocaleString()}`]);
    } else if (type === 'monthly') {
      hdrs = ['Month', 'Bookings', 'Revenue', 'GST Collected'];
      const map = new Map<string, { count: number; revenue: number; gst: number }>();
      books.forEach((b) => {
        const month = (b.created_at || '').slice(0, 7);
        if (!month) return;
        const entry = map.get(month) || { count: 0, revenue: 0, gst: 0 };
        entry.count++;
        if (b.payment_status === 'paid') {
          entry.revenue += Number(b.grand_total || 0);
          entry.gst += Number(b.taxes || 0);
        }
        map.set(month, entry);
      });
      rows = Array.from(map.entries()).map(([month, v]) => [month, v.count, `₹${v.revenue.toLocaleString()}`, `₹${v.gst.toLocaleString()}`]);
    } else if (type === 'yearly') {
      hdrs = ['Year', 'Bookings', 'Revenue', 'GST Collected'];
      const map = new Map<string, { count: number; revenue: number; gst: number }>();
      books.forEach((b) => {
        const year = (b.created_at || '').slice(0, 4);
        if (!year) return;
        const entry = map.get(year) || { count: 0, revenue: 0, gst: 0 };
        entry.count++;
        if (b.payment_status === 'paid') {
          entry.revenue += Number(b.grand_total || 0);
          entry.gst += Number(b.taxes || 0);
        }
        map.set(year, entry);
      });
      rows = Array.from(map.entries()).map(([year, v]) => [year, v.count, `₹${v.revenue.toLocaleString()}`, `₹${v.gst.toLocaleString()}`]);
    } else if (type === 'booking') {
      hdrs = ['Booking ID', 'Customer', 'Room/Experience', 'Check-in', 'Check-out', 'Amount', 'Status', 'Date'];
      rows = books.map((b) => [b.id.slice(0, 8), b.guest_name, b.room_type || b.experience || '', b.check_in || '', b.check_out || '', `₹${Number(b.grand_total).toLocaleString()}`, b.status, new Date(b.created_at).toLocaleDateString()]);
    } else if (type === 'occupancy') {
      hdrs = ['Room', 'Bookings', 'Revenue'];
      const map = new Map<string, { count: number; revenue: number }>();
      books.forEach((b) => {
        if (!b.room_type) return;
        const entry = map.get(b.room_type) || { count: 0, revenue: 0 };
        entry.count++;
        entry.revenue += Number(b.grand_total || 0);
        map.set(b.room_type, entry);
      });
      rows = Array.from(map.entries()).map(([room, v]) => [room, v.count, `₹${v.revenue.toLocaleString()}`]);
    } else if (type === 'experience') {
      hdrs = ['Experience', 'Bookings', 'Revenue'];
      const map = new Map<string, { count: number; revenue: number }>();
      books.forEach((b) => {
        if (!b.experience) return;
        const entry = map.get(b.experience) || { count: 0, revenue: 0 };
        entry.count++;
        entry.revenue += Number(b.grand_total || 0);
        map.set(b.experience, entry);
      });
      rows = Array.from(map.entries()).map(([exp, v]) => [exp, v.count, `₹${v.revenue.toLocaleString()}`]);
    } else if (type === 'payment') {
      hdrs = ['Booking ID', 'Customer', 'Amount', 'GST', 'Final', 'Payment Status', 'Refund Status', 'Date'];
      rows = books.map((b) => [b.id.slice(0, 8), b.guest_name, `₹${Number(b.estimated_price).toLocaleString()}`, `₹${Number(b.taxes).toLocaleString()}`, `₹${Number(b.grand_total).toLocaleString()}`, b.payment_status, b.refund_status, new Date(b.created_at).toLocaleDateString()]);
    } else if (type === 'gst') {
      hdrs = ['Booking ID', 'Customer', 'Base Amount', 'GST (5%)', 'Grand Total', 'Payment Status', 'Date'];
      rows = books.map((b) => [b.id.slice(0, 8), b.guest_name, `₹${Number(b.estimated_price).toLocaleString()}`, `₹${Number(b.taxes).toLocaleString()}`, `₹${Number(b.grand_total).toLocaleString()}`, b.payment_status, new Date(b.created_at).toLocaleDateString()]);
    }

    setHeaders(hdrs);
    setData(rows);
    setLoading(false);
  }, []);

  useEffect(() => { generateReport(selected); }, [selected, generateReport]);

  const reportLabel = REPORTS.find((r) => r.id === selected)?.label || 'Report';

  return (
    <div>
      <h1 className="font-serif text-3xl text-charcoal mb-6">Reports & Analytics</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {REPORTS.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelected(r.id)}
            className={`p-4 rounded-xl text-left transition-colors ${selected === r.id ? 'bg-gold-400 text-white' : 'bg-white text-charcoal hover:bg-gold-50'}`}
          >
            <FileBarChart size={20} className="mb-2" />
            <p className="text-sm font-medium">{r.label}</p>
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-6">
        <button onClick={() => exportCSV(reportLabel, headers, data)} className="btn-outline !text-xs flex items-center gap-2">
          <Download size={14} /> CSV
        </button>
        <button onClick={() => exportExcel(reportLabel, headers, data)} className="btn-outline !text-xs flex items-center gap-2">
          <FileSpreadsheet size={14} /> Excel
        </button>
        <button onClick={() => exportPDF(reportLabel, headers, data)} className="btn-outline !text-xs flex items-center gap-2">
          <Printer size={14} /> PDF
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : data.length === 0 ? (
        <div className="card-luxury p-12 text-center">
          <FileText size={40} className="text-gold-300 mx-auto mb-4" />
          <p className="text-charcoal/50">No data available for this report yet.</p>
        </div>
      ) : (
        <div className="card-luxury overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gold-50 text-charcoal/60 text-xs uppercase tracking-[0.05em]">
              <tr>
                {headers.map((h) => <th key={h} className="p-3 text-left">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className="border-t border-gold-50 hover:bg-gold-50/50">
                  {row.map((cell, j) => <td key={j} className="p-3 text-charcoal/70">{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
