import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, X, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { EXPERIENCES } from '@/lib/data';
import type { Experience } from '@/lib/types';

export default function AdminExperiences() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editExp, setEditExp] = useState<Experience | null>(null);
  const [form, setForm] = useState<Partial<Experience>>({});

  const loadExperiences = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('experiences').select('*').order('sort_order', { ascending: true });
    if (data && data.length > 0) {
      setExperiences(data as Experience[]);
    } else {
      setExperiences(EXPERIENCES);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadExperiences(); }, [loadExperiences]);

  const openAdd = () => {
    setEditExp(null);
    setForm({ is_featured: false, price: 0, sort_order: experiences.length + 1, highlights: [], included: [], excluded: [], gallery: [], itinerary: [] });
    setShowModal(true);
  };

  const openEdit = (exp: Experience) => {
    setEditExp(exp);
    setForm(exp);
    setShowModal(true);
  };

  const saveExp = async () => {
    if (!form.title || !form.slug) return;
    if (editExp) {
      await supabase.from('experiences').update(form).eq('id', editExp.id);
    } else {
      await supabase.from('experiences').insert(form);
    }
    setShowModal(false);
    loadExperiences();
  };

  const deleteExp = async (id: string) => {
    if (!confirm('Delete this experience?')) return;
    await supabase.from('experiences').delete().eq('id', id);
    loadExperiences();
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl text-charcoal">Experience Management</h1>
        <button onClick={openAdd} className="btn-gold flex items-center gap-2">
          <Plus size={16} /> Add Experience
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiences.map((exp) => (
          <div key={exp.id} className="card-luxury overflow-hidden">
            <div className="relative h-40">
              <img src={exp.image_url} alt={exp.title} className="w-full h-full object-cover" />
              <span className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full bg-charcoal/70 text-ivory">{exp.category}</span>
              {exp.is_featured && (
                <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full bg-gold-400 text-white">Featured</span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-serif text-lg text-charcoal">{exp.title}</h3>
              <p className="text-sm text-gold-600">₹{exp.price.toLocaleString()}/person</p>
              <p className="text-xs text-charcoal/50 mt-1">{exp.duration} • {exp.location}</p>
              <div className="flex gap-2 mt-4">
                <button onClick={() => openEdit(exp)} className="flex-1 btn-outline !text-xs flex items-center justify-center gap-1">
                  <Pencil size={12} /> Edit
                </button>
                <button onClick={() => deleteExp(exp.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gold-50">
              <h2 className="font-serif text-xl text-charcoal">{editExp ? 'Edit Experience' : 'Add Experience'}</h2>
              <button onClick={() => setShowModal(false)} className="text-charcoal/40 hover:text-charcoal">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="label-luxury">Title</label>
                <input value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} className="input-luxury" placeholder="Camel Safari" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-luxury">Category</label>
                  <select value={form.category || 'Safari'} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-luxury">
                    <option value="Safari">Safari</option>
                    <option value="Desert Camp">Desert Camp</option>
                    <option value="Tour">Tour</option>
                    <option value="Culture">Culture</option>
                    <option value="Adventure">Adventure</option>
                  </select>
                </div>
                <div>
                  <label className="label-luxury">Price (₹/person)</label>
                  <input type="number" value={form.price || 0} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="input-luxury" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-luxury">Duration</label>
                  <input value={form.duration || ''} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="input-luxury" placeholder="2-4 hours" />
                </div>
                <div>
                  <label className="label-luxury">Location</label>
                  <input value={form.location || ''} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input-luxury" placeholder="Sam Sand Dunes" />
                </div>
              </div>
              <div>
                <label className="label-luxury">Short Description</label>
                <textarea value={form.short_description || ''} onChange={(e) => setForm({ ...form, short_description: e.target.value })} rows={2} className="input-luxury resize-none" />
              </div>
              <div>
                <label className="label-luxury">Image URL</label>
                <input value={form.image_url || ''} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="input-luxury" placeholder="https://..." />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_featured ?? false} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="w-4 h-4 rounded text-gold-500" />
                <span className="text-sm text-charcoal/60">Featured experience</span>
              </label>
              <button onClick={saveExp} className="btn-gold w-full">Save Experience</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
