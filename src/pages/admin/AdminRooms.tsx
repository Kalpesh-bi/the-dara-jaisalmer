import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, X, Loader2, BedDouble } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { ROOMS } from '@/lib/data';
import type { RoomType } from '@/lib/types';

const DEFAULT_AMENITIES = ['WiFi', 'AC', 'TV', 'Breakfast', 'Mini Bar', 'Private Bathroom', 'Balcony'];

export default function AdminRooms() {
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editRoom, setEditRoom] = useState<RoomType | null>(null);
  const [form, setForm] = useState<Partial<RoomType>>({});
  const [amenityInput, setAmenityInput] = useState('');

  const loadRooms = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('room_types').select('*').order('sort_order', { ascending: true });
    if (data && data.length > 0) {
      setRooms(data as RoomType[]);
    } else {
      setRooms(ROOMS);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadRooms(); }, [loadRooms]);

  const openAdd = () => {
    setEditRoom(null);
    setForm({ amenities: [], is_available: true, max_guests: 2, price: 0, sort_order: rooms.length + 1, gallery: [] });
    setShowModal(true);
  };

  const openEdit = (room: RoomType) => {
    setEditRoom(room);
    setForm(room);
    setShowModal(true);
  };

  const saveRoom = async () => {
    if (!form.name || !form.slug) return;
    if (editRoom) {
      await supabase.from('room_types').update(form).eq('id', editRoom.id);
    } else {
      await supabase.from('room_types').insert(form);
    }
    setShowModal(false);
    loadRooms();
  };

  const deleteRoom = async (id: string) => {
    if (!confirm('Are you sure you want to delete this room?')) return;
    await supabase.from('room_types').delete().eq('id', id);
    loadRooms();
  };

  const addAmenity = () => {
    if (amenityInput && !form.amenities?.includes(amenityInput)) {
      setForm({ ...form, amenities: [...(form.amenities || []), amenityInput] });
      setAmenityInput('');
    }
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
        <h1 className="font-serif text-3xl text-charcoal">Room Management</h1>
        <button onClick={openAdd} className="btn-gold flex items-center gap-2">
          <Plus size={16} /> Add Room
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div key={room.id} className="card-luxury overflow-hidden">
            <div className="relative h-40">
              <img src={room.image_url} alt={room.name} className="w-full h-full object-cover" />
              <span className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full ${room.is_available ? 'bg-olive-100 text-olive-700' : 'bg-red-100 text-red-700'}`}>
                {room.is_available ? 'Available' : 'Booked'}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-serif text-lg text-charcoal">{room.name}</h3>
              <p className="text-sm text-gold-600">₹{room.price.toLocaleString()}/night</p>
              <p className="text-xs text-charcoal/50 mt-1">Max {room.max_guests} guests</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {(room.amenities || []).slice(0, 4).map((a) => (
                  <span key={a} className="text-xs px-2 py-0.5 bg-gold-50 text-charcoal/60 rounded-full">{a}</span>
                ))}
                {(room.amenities || []).length > 4 && (
                  <span className="text-xs px-2 py-0.5 bg-gold-50 text-charcoal/60 rounded-full">
                    +{(room.amenities || []).length - 4}
                  </span>
                )}
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => openEdit(room)} className="flex-1 btn-outline !text-xs flex items-center justify-center gap-1">
                  <Pencil size={12} /> Edit
                </button>
                <button onClick={() => deleteRoom(room.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
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
              <h2 className="font-serif text-xl text-charcoal">{editRoom ? 'Edit Room' : 'Add Room'}</h2>
              <button onClick={() => setShowModal(false)} className="text-charcoal/40 hover:text-charcoal">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="label-luxury">Room Name</label>
                <input value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} className="input-luxury" placeholder="Superior Room" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-luxury">Price (₹/night)</label>
                  <input type="number" value={form.price || 0} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="input-luxury" />
                </div>
                <div>
                  <label className="label-luxury">Max Guests</label>
                  <input type="number" value={form.max_guests || 2} onChange={(e) => setForm({ ...form, max_guests: Number(e.target.value) })} className="input-luxury" />
                </div>
              </div>
              <div>
                <label className="label-luxury">Description</label>
                <textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input-luxury resize-none" />
              </div>
              <div>
                <label className="label-luxury">Image URL</label>
                <input value={form.image_url || ''} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="input-luxury" placeholder="https://..." />
              </div>
              <div>
                <label className="label-luxury">Amenities</label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={amenityInput}
                    onChange={(e) => setAmenityInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
                    className="input-luxury flex-1"
                    placeholder="Add amenity..."
                    list="amenities-list"
                  />
                  <datalist id="amenities-list">
                    {DEFAULT_AMENITIES.map((a) => <option key={a} value={a} />)}
                  </datalist>
                  <button type="button" onClick={addAmenity} className="btn-outline !px-4">Add</button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {(form.amenities || []).map((a) => (
                    <span key={a} className="text-xs px-2 py-1 bg-gold-50 text-charcoal/60 rounded-full flex items-center gap-1">
                      {a}
                      <button onClick={() => setForm({ ...form, amenities: (form.amenities || []).filter((x) => x !== a) })}>
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_available ?? true} onChange={(e) => setForm({ ...form, is_available: e.target.checked })} className="w-4 h-4 rounded text-gold-500" />
                <span className="text-sm text-charcoal/60">Available for booking</span>
              </label>
              <button onClick={saveRoom} className="btn-gold w-full">Save Room</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
