import PageHero from '@/components/PageHero';
import { IMG } from '@/lib/data';

export default function Terms() {
  return (
    <>
      <PageHero image={IMG.heroCourtyard} title="Terms & Conditions" breadcrumb="Terms" />
      <section className="py-20">
        <div className="container-luxury max-w-3xl space-y-8 text-charcoal/70 leading-[1.8]">
          <Section title="1. Bookings & Reservations">
            All bookings are subject to availability. A booking is confirmed only after we send a confirmation email or message. Prices are subject to change without notice.
          </Section>
          <Section title="2. Payment">
            We accept bank transfers, UPI, and major credit/debit cards. A deposit may be required to confirm your booking. The balance is due upon check-in unless otherwise agreed.
          </Section>
          <Section title="3. Cancellation Policy">
            Cancellations made 7+ days before check-in: full refund. 3–6 days: 50% refund. Less than 3 days: no refund. No-shows are non-refundable.
          </Section>
          <Section title="4. Check-in & Check-out">
            Standard check-in time is 12:00 PM and check-out is 11:00 AM. Early check-in and late check-out are subject to availability and may incur additional charges.
          </Section>
          <Section title="5. Guest Conduct">
            Guests are expected to respect the property, staff, and other guests. Any damage to property will be charged to the guest. We reserve the right to refuse service.
          </Section>
          <Section title="6. Desert Experiences">
            Desert safaris and camps are weather-dependent. We reserve the right to modify or cancel experiences due to unsafe conditions. Refunds will be provided for cancelled experiences.
          </Section>
          <Section title="7. Liability">
            The Dara Jaisalmer is not liable for personal injury, loss, or damage to personal property during your stay or during desert activities. We recommend travel insurance.
          </Section>
          <p className="text-sm text-charcoal/40">Last updated: January 2025</p>
        </div>
      </section>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-serif text-2xl text-charcoal mb-3">{title}</h2>
      <p>{children}</p>
    </div>
  );
}
