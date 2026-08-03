import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, Mail, MapPin, Clock, Send, Loader2, AlertCircle } from 'lucide-react';
import { CONTACT, IMG } from '@/lib/data';
import { supabase } from '@/lib/supabase';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, 'Please enter a message'),
});

type FormData = z.infer<typeof schema>;

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject || null,
        message: data.message,
      });
      if (error) throw error;
      setSuccess(true);
      reset();
    } catch {
      setError('Could not send your message. Please try calling or WhatsApp us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHero
        image={IMG.heroSuryagarh}
        title="Contact Us"
        subtitle="We're here to help you plan the perfect Jaisalmer experience."
        breadcrumb="Contact"
      />

      <section className="py-20">
        <div className="container-luxury grid lg:grid-cols-2 gap-12">
          {/* Info */}
          <div>
            <SectionHeading label="Get in Touch" title="We'd Love to Hear From You" />
            <p className="mt-6 text-body">
              Whether you have questions about rooms, experiences, or want to plan a custom itinerary, our team is ready to assist you.
            </p>

            <div className="mt-10 space-y-5">
              <ContactItem icon={MapPin} label="Address" value={CONTACT.address} />
              <ContactItem icon={Phone} label="Phone" value={CONTACT.phone} href={`tel:${CONTACT.phone.replace(/\s/g, '')}`} />
              <ContactItem icon={Mail} label="Email" value={CONTACT.email} href={`mailto:${CONTACT.email}`} />
              <ContactItem icon={Clock} label="Business Hours" value={CONTACT.hours} />
              <ContactItem icon={Phone} label="Emergency Contact" value={CONTACT.emergency} href={`tel:${CONTACT.emergency.replace(/\s/g, '')}`} />
            </div>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${CONTACT.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-3 bg-[#25D366] text-white px-6 py-3.5 rounded-full font-sans text-sm uppercase tracking-[0.1em] hover:opacity-90 transition-opacity"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.75 1.21h.04c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01C17.18 3.03 14.69 2 12.04 2z"/></svg>
              Chat on WhatsApp
            </a>
          </div>

          {/* Form */}
          <div className="card-luxury p-8">
            {success ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-olive-100 flex items-center justify-center mx-auto mb-6">
                  <Send size={28} className="text-olive-600" />
                </div>
                <h3 className="font-serif text-2xl text-charcoal mb-3">Message Sent!</h3>
                <p className="text-body mb-6">We'll get back to you within 24 hours.</p>
                <button onClick={() => setSuccess(false)} className="btn-outline">Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <h3 className="font-serif text-2xl text-charcoal mb-2">Send a Message</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label-luxury">Name *</label>
                    <input {...register('name')} className="input-luxury" placeholder="Your name" />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="label-luxury">Phone</label>
                    <input {...register('phone')} className="input-luxury" placeholder="+91 90000 00000" />
                  </div>
                </div>
                <div>
                  <label className="label-luxury">Email *</label>
                  <input {...register('email')} type="email" className="input-luxury" placeholder="your@email.com" />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="label-luxury">Subject</label>
                  <input {...register('subject')} className="input-luxury" placeholder="Booking inquiry" />
                </div>
                <div>
                  <label className="label-luxury">Message *</label>
                  <textarea {...register('message')} rows={5} className="input-luxury resize-none" placeholder="Tell us about your trip..." />
                  {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>}
                </div>
                {error && (
                  <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-xl">
                    <AlertCircle size={16} /> {error}
                  </div>
                )}
                <button type="submit" disabled={loading} className="btn-gold w-full disabled:opacity-60">
                  {loading ? <><Loader2 size={18} className="animate-spin" /> Sending...</> : <><Send size={16} /> Send Message</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="pb-20">
        <div className="container-luxury">
          <div className="rounded-2xl overflow-hidden shadow-soft h-[400px] bg-gold-50 flex items-center justify-center">
            <div className="text-center">
              <MapPin size={48} className="text-gold-400 mx-auto mb-3" />
              <p className="font-serif text-xl text-charcoal">{CONTACT.address}</p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Jaisalmer+Rajasthan"
                target="_blank"
                rel="noreferrer"
                className="btn-outline mt-4"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ContactItem({ icon: Icon, label, value, href }: { icon: typeof Phone; label: string; value: string; href?: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-12 h-12 rounded-full bg-gold-50 flex items-center justify-center shrink-0">
        <Icon size={20} className="text-gold-600" />
      </div>
      <div>
        <p className="text-xs font-sans uppercase tracking-[0.1em] text-charcoal/40 mb-1">{label}</p>
        {href ? (
          <a href={href} className="text-charcoal/70 hover:text-gold-600 transition-colors">{value}</a>
        ) : (
          <p className="text-charcoal/70">{value}</p>
        )}
      </div>
    </div>
  );
}
