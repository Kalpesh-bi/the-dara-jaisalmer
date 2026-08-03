import { useState, useEffect, useCallback } from 'react';
import { Check, X, Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Review } from '@/lib/types';

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
    setReviews((data || []) as Review[]);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const approve = async (id: string) => {
    await supabase.from('reviews').update({ is_approved: true }).eq('id', id);
    load();
  };

  const reject = async (id: string) => {
    await supabase.from('reviews').update({ is_approved: false }).eq('id', id);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    await supabase.from('reviews').delete().eq('id', id);
    load();
  };

  const filtered = reviews.filter((r) =>
    filter === 'all' || (filter === 'approved' && r.is_approved) || (filter === 'pending' && !r.is_approved)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-charcoal mb-6">Reviews Management</h1>

      <div className="flex gap-2 mb-6">
        {['all', 'approved', 'pending'].map((f) => (
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
          <Star size={40} className="text-gold-300 mx-auto mb-4" />
          <p className="text-charcoal/50">No reviews yet. Customer reviews will appear here for approval.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((r) => (
            <div key={r.id} className="card-luxury p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-serif text-lg text-charcoal">{r.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${r.is_approved ? 'bg-olive-100 text-olive-700' : 'bg-amber-100 text-amber-700'}`}>
                      {r.is_approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star key={n} size={14} className={n <= r.rating ? 'fill-gold-400 text-gold-400' : 'text-gray-300'} />
                    ))}
                  </div>
                  <p className="text-sm text-charcoal/60">{r.body}</p>
                  <p className="text-xs text-gold-600 mt-2">— {r.guest_name}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {!r.is_approved && (
                    <button onClick={() => approve(r.id)} className="p-2 bg-olive-100 hover:bg-olive-200 rounded-lg" title="Approve">
                      <Check size={16} className="text-olive-600" />
                    </button>
                  )}
                  {r.is_approved && (
                    <button onClick={() => reject(r.id)} className="p-2 bg-amber-100 hover:bg-amber-200 rounded-lg" title="Unapprove">
                      <X size={16} className="text-amber-600" />
                    </button>
                  )}
                  <button onClick={() => remove(r.id)} className="p-2 bg-red-50 hover:bg-red-100 rounded-lg" title="Delete">
                    <X size={16} className="text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
