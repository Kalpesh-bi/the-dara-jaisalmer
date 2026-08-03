import { useState, useEffect, useCallback } from 'react';
import { Download, Eye, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { exportCSV } from '@/lib/export-utils';
import type { ContactEnquiry } from '@/lib/admin-types';

export default function AdminEnquiries() {
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<ContactEnquiry | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    setEnquiries((data || []) as ContactEnquiry[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('contact_messages').update({ status }).eq('id', id);
    setSelected(null);
    load();
  };

  const filtered = enquiries.filter((e) => filter === 'all' || e.status === filter);

  const handleExport = () => {
    const headers = ['Name', 'Email', 'Phone', 'Subject', 'Message', 'Status', 'Date'];
    const rows = filtered.map((e) => [e.name, e.email, e.phone || '', e.subject || '', e.message, e.status, new Date(e.created_at).toLocaleDateString()]);
    exportCSV('enquiries', headers, rows);
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
        <h1 className="font-serif text-3xl text-charcoal">Contact Enquiries</h1>
        <button onClick={handleExport} className="btn-outline !text-xs flex items-center gap-2 self-start">
          <Download size={14} /> Export CSV
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {['all', 'new', 'contacted', 'closed'].map((f) => (
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
          <p className="text-charcoal/50">No enquiries found. Contact form submissions will appear here automatically.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((e) => (
            <div key={e.id} className="card-luxury p-5 flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <p className="font-medium text-charcoal">{e.name}</p>
                  <StatusBadge status={e.status} />
                </div>
                <p className="text-sm text-charcoal/60">{e.email} {e.phone && `• ${e.phone}`}</p>
                <p className="text-sm text-charcoal/50 mt-1 truncate">{e.subject || e.message}</p>
                <p className="text-xs text-charcoal/40 mt-1">{new Date(e.created_at).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelected(e)} className="p-2 hover:bg-gold-100 rounded-lg shrink-0">
                <Eye size={18} className="text-charcoal/50" />
              </button>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gold-50">
              <h2 className="font-serif text-xl text-charcoal">Enquiry Details</h2>
              <button onClick={() => setSelected(null)} className="text-charcoal/40 hover:text-charcoal">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-3">
              <DetailRow label="Name" value={selected.name} />
              <DetailRow label="Email" value={selected.email} />
              <DetailRow label="Phone" value={selected.phone || 'N/A'} />
              <DetailRow label="Subject" value={selected.subject || 'N/A'} />
              <div className="py-2 border-b border-gold-50">
                <p className="text-sm text-charcoal/50 mb-1">Message</p>
                <p className="text-sm text-charcoal">{selected.message}</p>
              </div>
              <DetailRow label="Status" value={selected.status} />
              <DetailRow label="Date" value={new Date(selected.created_at).toLocaleString()} />
              <div className="flex gap-2 pt-2">
                {selected.status === 'new' && (
                  <button onClick={() => updateStatus(selected.id, 'contacted')} className="btn-outline flex-1">Mark Contacted</button>
                )}
                {selected.status !== 'closed' && (
                  <button onClick={() => updateStatus(selected.id, 'closed')} className="btn-gold flex-1">Close Enquiry</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    contacted: 'bg-amber-100 text-amber-700',
    closed: 'bg-gray-100 text-gray-600',
  };
  return <span className={`text-xs px-2 py-1 rounded-full capitalize ${colors[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-gold-50">
      <span className="text-sm text-charcoal/50">{label}</span>
      <span className="text-sm text-charcoal font-medium text-right">{value}</span>
    </div>
  );
}
