import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, Loader2, Calendar, Users, MapPin, Tag, Calculator } from 'lucide-react';
import { ROOMS, EXPERIENCES, PICKUP_LOCATIONS, IMG } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import PageHero from '@/components/PageHero';

const schema = z.object({
  guest_name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Valid phone required'),
  country: z.string().optional(),
  adults: z.number().min(1).max(20),
  children: z.number().min(0).max(20),
  check_in: z.string().optional(),
  check_out: z.string().optional(),
  room_type: z.string().optional(),
  experience: z.string().optional(),
  pickup_required: z.boolean(),
  pickup_location: z.string().optional(),
  drop_required: z.boolean(),
  drop_location: z.string().optional(),
  number_of_days: z.number().min(1).max(30),
  special_request: z.string().optional(),
  coupon_code: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const PICKUP_PRICE = 500;
const EXTRA_GUEST_PRICE = 500;
const GST_RATE = 0.05;

export default function Booking() {
  const [params] = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [discount, setDiscount] = useState(0);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      adults: Number(params.get('adults')) || 2,
      children: Number(params.get('children')) || 0,
      pickup_required: params.get('pickup') === 'true',
      pickup_location: params.get('pickup_location') || '',
      check_in: params.get('check_in') || '',
      check_out: params.get('check_out') || '',
      number_of_days: 1,
    },
  });

  const roomType = watch('room_type');
  const experienceSlug = watch('experience');
  const adults = watch('adults');
  const children = watch('children');
  const pickupRequired = watch('pickup_required');
  const dropRequired = watch('drop_required');
  const days = watch('number_of_days');
  const couponCode = watch('coupon_code');

  const pricing = useMemo(() => {
    const room = ROOMS.find((r) => r.slug === roomType);
    const exp = EXPERIENCES.find((e) => e.slug === experienceSlug);
    const roomPrice = room ? room.price * days : 0;
    const expPrice = exp ? exp.price * (adults + children) : 0;
    const pickup = (pickupRequired ? PICKUP_PRICE : 0) + (dropRequired ? PICKUP_PRICE : 0);
    const extraGuests = Math.max(0, (adults + children) - 2) * EXTRA_GUEST_PRICE * days;
    const subtotal = roomPrice + expPrice + pickup + extraGuests;
    const discountAmount = (subtotal * discount) / 100;
    const taxableAmount = subtotal - discountAmount;
    const taxes = Math.round(taxableAmount * GST_RATE);
    const grandTotal = taxableAmount + taxes;
    return { roomPrice, expPrice, pickup, extraGuests, subtotal, discountAmount, taxes, grandTotal };
  }, [roomType, experienceSlug, adults, children, pickupRequired, dropRequired, days, discount]);

  const applyCoupon = async () => {
    if (!couponCode) return;
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('is_active', true)
        .maybeSingle();
      if (error || !data) {
        setError('Invalid or expired coupon code');
        setDiscount(0);
        return;
      }
      setError('');
      setDiscount(Number(data.discount_value));
    } catch {
      setError('Could not verify coupon. You can still proceed with booking.');
      setDiscount(0);
    }
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.from('bookings').insert({
        guest_name: data.guest_name,
        email: data.email,
        phone: data.phone,
        country: data.country || null,
        adults: data.adults,
        children: data.children,
        check_in: data.check_in || null,
        check_out: data.check_out || null,
        room_type: data.room_type || null,
        experience: data.experience || null,
        pickup_required: data.pickup_required,
        pickup_location: data.pickup_location || null,
        drop_required: data.drop_required,
        drop_location: data.drop_location || null,
        number_of_days: data.number_of_days,
        special_request: data.special_request || null,
        coupon_code: data.coupon_code || null,
        estimated_price: pricing.subtotal,
        taxes: pricing.taxes,
        grand_total: pricing.grandTotal,
        status: 'pending',
      });
      if (error) throw error;
      setSubmitted(true);
    } catch {
      setError('Could not submit your booking. Please try again or call us directly.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <>
        <PageHero image={IMG.heroDesert2} title="Booking Received" breadcrumb="Booking" />
        <section className="py-20">
          <div className="container-luxury max-w-xl text-center">
            <div className="w-20 h-20 rounded-full bg-olive-100 flex items-center justify-center mx-auto mb-6">
              <Check size={40} className="text-olive-600" />
            </div>
            <h2 className="heading-2 mb-4">Thank You!</h2>
            <p className="text-body mb-8">
              Your booking request has been received. Our team will contact you within 24 hours to confirm your reservation and arrange payment.
            </p>
            <div className="card-luxury p-6 mb-8 text-left">
              <div className="flex justify-between py-2 border-b border-gold-50">
                <span className="text-sm text-charcoal/60">Estimated Total</span>
                <span className="font-serif text-xl text-gold-600">₹{pricing.grandTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-charcoal/60">Status</span>
                <span className="text-sm text-olive-600 font-medium">Pending Confirmation</span>
              </div>
            </div>
            <Link to="/" className="btn-gold">Back to Home</Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero image={IMG.heroSuryagarh} title="Book Your Stay" subtitle="Reserve your room and desert experiences in a few simple steps." breadcrumb="Booking" />

      <section className="py-20">
        <div className="container-luxury grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-8">
            {/* Guest Details */}
            <div className="card-luxury p-8">
              <h3 className="font-serif text-2xl text-charcoal mb-6">Guest Details</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-luxury">Full Name *</label>
                  <input {...register('guest_name')} className="input-luxury" placeholder="John Doe" />
                  {errors.guest_name && <p className="text-xs text-red-500 mt-1">{errors.guest_name.message}</p>}
                </div>
                <div>
                  <label className="label-luxury">Email *</label>
                  <input {...register('email')} type="email" className="input-luxury" placeholder="john@example.com" />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="label-luxury">Phone *</label>
                  <input {...register('phone')} className="input-luxury" placeholder="+91 90000 00000" />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                </div>
                <div>
                  <label className="label-luxury">Country</label>
                  <input {...register('country')} className="input-luxury" placeholder="India" />
                </div>
              </div>
            </div>

            {/* Stay Details */}
            <div className="card-luxury p-8">
              <h3 className="font-serif text-2xl text-charcoal mb-6">Stay Details</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-luxury flex items-center gap-1.5"><Calendar size={12} /> Check-in</label>
                  <input {...register('check_in')} type="date" className="input-luxury" />
                </div>
                <div>
                  <label className="label-luxury flex items-center gap-1.5"><Calendar size={12} /> Check-out</label>
                  <input {...register('check_out')} type="date" className="input-luxury" />
                </div>
                <div>
                  <label className="label-luxury flex items-center gap-1.5"><Users size={12} /> Adults</label>
                  <select {...register('adults', { valueAsNumber: true })} className="input-luxury">
                    {[1,2,3,4,5,6,8,10].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-luxury flex items-center gap-1.5"><Users size={12} /> Children</label>
                  <select {...register('children', { valueAsNumber: true })} className="input-luxury">
                    {[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-luxury">Number of Days</label>
                  <select {...register('number_of_days', { valueAsNumber: true })} className="input-luxury">
                    {[1,2,3,4,5,7,10,14].map(n => <option key={n} value={n}>{n} Day{n > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-luxury">Room Type</label>
                  <select {...register('room_type')} className="input-luxury">
                    <option value="">Select room</option>
                    {ROOMS.map(r => <option key={r.slug} value={r.slug}>{r.name} — ₹{r.price.toLocaleString()}/night</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="label-luxury">Experience</label>
                  <select {...register('experience')} className="input-luxury">
                    <option value="">No experience</option>
                    {EXPERIENCES.map(e => <option key={e.slug} value={e.slug}>{e.title} — ₹{e.price.toLocaleString()}/person</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Pickup & Drop */}
            <div className="card-luxury p-8">
              <h3 className="font-serif text-2xl text-charcoal mb-6">Pickup & Drop</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-luxury flex items-center gap-1.5"><MapPin size={12} /> Pickup Required</label>
                  <select {...register('pickup_required', { setValueAs: (v) => v === 'true' || v === true })} className="input-luxury">
                    <option value="false">No</option>
                    <option value="true">Yes (+₹{PICKUP_PRICE})</option>
                  </select>
                </div>
                <div>
                  <label className="label-luxury">Pickup Location</label>
                  <select {...register('pickup_location')} className="input-luxury">
                    <option value="">Select location</option>
                    {PICKUP_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-luxury flex items-center gap-1.5"><MapPin size={12} /> Drop Required</label>
                  <select {...register('drop_required', { setValueAs: (v) => v === 'true' || v === true })} className="input-luxury">
                    <option value="false">No</option>
                    <option value="true">Yes (+₹{PICKUP_PRICE})</option>
                  </select>
                </div>
                <div>
                  <label className="label-luxury">Drop Location</label>
                  <select {...register('drop_location')} className="input-luxury">
                    <option value="">Select location</option>
                    {PICKUP_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Special Request & Coupon */}
            <div className="card-luxury p-8">
              <h3 className="font-serif text-2xl text-charcoal mb-6">Additional Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="label-luxury">Special Request</label>
                  <textarea {...register('special_request')} rows={3} className="input-luxury resize-none" placeholder="Any special requirements..." />
                </div>
                <div>
                  <label className="label-luxury flex items-center gap-1.5"><Tag size={12} /> Promo Code</label>
                  <div className="flex gap-3">
                    <input {...register('coupon_code')} className="input-luxury" placeholder="DARA10" />
                    <button type="button" onClick={applyCoupon} className="btn-outline !px-5 !py-3 whitespace-nowrap">Apply</button>
                  </div>
                  {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
                  {discount > 0 && <p className="text-xs text-olive-600 mt-1">Coupon applied: {discount}% off</p>}
                </div>
              </div>
            </div>

            {error && !couponCode && (
              <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl">{error}</div>
            )}

            <button type="submit" disabled={loading} className="btn-gold w-full disabled:opacity-60">
              {loading ? <><Loader2 size={18} className="animate-spin" /> Submitting...</> : 'Confirm Booking'}
            </button>
          </form>

          {/* Price Calculator */}
          <aside className="space-y-6">
            <div className="card-luxury p-6 sticky top-20">
              <h3 className="font-serif text-2xl text-charcoal mb-6 flex items-center gap-2">
                <Calculator size={20} className="text-gold-500" /> Price Estimate
              </h3>
              <div className="space-y-3 text-sm">
                <PriceRow label="Room" value={pricing.roomPrice} show={pricing.roomPrice > 0} />
                <PriceRow label="Experience" value={pricing.expPrice} show={pricing.expPrice > 0} />
                <PriceRow label="Pickup & Drop" value={pricing.pickup} show={pricing.pickup > 0} />
                <PriceRow label="Extra Guests" value={pricing.extraGuests} show={pricing.extraGuests > 0} />
                {discount > 0 && (
                  <div className="flex justify-between text-olive-600">
                    <span>Discount ({discount}%)</span>
                    <span>-₹{pricing.discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t border-gold-100 pt-3 flex justify-between text-charcoal/60">
                  <span>Subtotal</span>
                  <span>₹{(pricing.subtotal - pricing.discountAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-charcoal/60">
                  <span>GST (5%)</span>
                  <span>₹{pricing.taxes.toLocaleString()}</span>
                </div>
                <div className="border-t border-gold-100 pt-3 flex justify-between items-center">
                  <span className="font-serif text-lg text-charcoal">Grand Total</span>
                  <span className="font-serif text-2xl text-gold-600">₹{pricing.grandTotal.toLocaleString()}</span>
                </div>
              </div>
              <p className="text-xs text-charcoal/40 mt-4 text-center">
                Final price confirmed by our team after booking.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}

function PriceRow({ label, value, show }: { label: string; value: number; show: boolean }) {
  if (!show) return null;
  return (
    <div className="flex justify-between text-charcoal/60">
      <span>{label}</span>
      <span>₹{value.toLocaleString()}</span>
    </div>
  );
}
