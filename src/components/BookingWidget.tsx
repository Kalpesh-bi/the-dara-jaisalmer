import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Users, MapPin } from 'lucide-react';
import { ROOMS, EXPERIENCES, PICKUP_LOCATIONS } from '@/lib/data';

export default function BookingWidget() {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [pickup, setPickup] = useState(false);
  const [pickupLocation, setPickupLocation] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams({
      check_in: checkIn,
      check_out: checkOut,
      adults: String(adults),
      children: String(children),
      rooms: String(rooms),
      pickup: String(pickup),
      pickup_location: pickupLocation,
    });
    navigate(`/booking?${params.toString()}`);
  };

  return (
    <div className="glass rounded-2xl shadow-soft-lg p-6 md:p-8 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div>
          <label className="label-luxury flex items-center gap-1.5"><Calendar size={12} /> Check-in</label>
          <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="input-luxury" />
        </div>
        <div>
          <label className="label-luxury flex items-center gap-1.5"><Calendar size={12} /> Check-out</label>
          <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="input-luxury" />
        </div>
        <div>
          <label className="label-luxury flex items-center gap-1.5"><Users size={12} /> Adults</label>
          <select value={adults} onChange={(e) => setAdults(Number(e.target.value))} className="input-luxury">
            {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Adult{n > 1 ? 's' : ''}</option>)}
          </select>
        </div>
        <div>
          <label className="label-luxury flex items-center gap-1.5"><Users size={12} /> Children</label>
          <select value={children} onChange={(e) => setChildren(Number(e.target.value))} className="input-luxury">
            {[0,1,2,3,4].map(n => <option key={n} value={n}>{n} Child{n !== 1 ? 'ren' : ''}</option>)}
          </select>
        </div>
        <div>
          <label className="label-luxury">Rooms</label>
          <select value={rooms} onChange={(e) => setRooms(Number(e.target.value))} className="input-luxury">
            {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} Room{n > 1 ? 's' : ''}</option>)}
          </select>
        </div>
        <div>
          <label className="label-luxury flex items-center gap-1.5"><MapPin size={12} /> Pickup Required</label>
          <select value={pickup ? 'yes' : 'no'} onChange={(e) => setPickup(e.target.value === 'yes')} className="input-luxury">
            <option value="no">No Pickup</option>
            <option value="yes">Yes, Pickup Needed</option>
          </select>
        </div>
        {pickup && (
          <div>
            <label className="label-luxury">Pickup Location</label>
            <select value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} className="input-luxury">
              <option value="">Select location</option>
              {PICKUP_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        )}
        <div className="flex items-end">
          <button onClick={handleSearch} className="btn-gold w-full">
            <Search size={16} /> Search
          </button>
        </div>
      </div>
    </div>
  );
}
