import PageHero from '@/components/PageHero';
import { IMG } from '@/lib/data';

export default function Refund() {
  return (
    <>
      <PageHero image={IMG.heroDesert2} title="Refund Policy" breadcrumb="Refund" />
      <section className="py-20">
        <div className="container-luxury max-w-3xl space-y-8 text-charcoal/70 leading-[1.8]">
          <Section title="Cancellation & Refund Timeline">
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>7+ days before check-in:</strong> Full refund of deposit</li>
              <li><strong>3–6 days before check-in:</strong> 50% refund of deposit</li>
              <li><strong>Less than 3 days:</strong> No refund</li>
              <li><strong>No-show:</strong> Non-refundable</li>
            </ul>
          </Section>
          <Section title="Experience Cancellations">
            If we cancel a desert experience due to weather or safety concerns, you will receive a full refund for that experience. If you cancel an experience less than 24 hours before departure, no refund will be provided.
          </Section>
          <Section title="Refund Processing">
            Refunds are processed within 7–10 business days to the original payment method. Bank transfer refunds may take longer depending on your bank.
          </Section>
          <Section title="Partial Refunds">
            If you shorten your stay after check-in, no refund will be provided for unused nights unless approved by management in exceptional circumstances.
          </Section>
          <Section title="How to Request a Refund">
            To request a cancellation or refund, contact us at stay@thedarajaisalmer.com or call +91 90000 00000 with your booking details.
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
      <div>{children}</div>
    </div>
  );
}
