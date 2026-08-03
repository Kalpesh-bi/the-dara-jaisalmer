import PageHero from '@/components/PageHero';
import { IMG } from '@/lib/data';

export default function Privacy() {
  return (
    <>
      <PageHero image={IMG.heroDesert3} title="Privacy Policy" breadcrumb="Privacy" />
      <section className="py-20">
        <div className="container-luxury max-w-3xl prose prose-lg">
          <div className="space-y-8 text-charcoal/70 leading-[1.8]">
            <Section title="Information We Collect">
              We collect information you provide when booking a stay, contacting us, or subscribing to updates. This includes your name, email, phone number, country, and booking preferences.
            </Section>
            <Section title="How We Use Your Information">
              Your information is used to process bookings, respond to inquiries, send confirmation and promotional emails, and improve our services. We never sell your data to third parties.
            </Section>
            <Section title="Data Security">
              We implement industry-standard security measures to protect your personal information. All data is stored securely and access is restricted to authorized personnel only.
            </Section>
            <Section title="Cookies">
              Our website uses cookies to enhance your browsing experience, analyze traffic, and personalize content. You can control cookies through your browser settings.
            </Section>
            <Section title="Third-Party Services">
              We may use third-party services such as payment gateways, analytics tools, and communication platforms. These services have their own privacy policies.
            </Section>
            <Section title="Your Rights">
              You have the right to access, correct, or delete your personal information. Contact us at stay@thedarajaisalmer.com for any privacy-related requests.
            </Section>
            <Section title="Updates to This Policy">
              We may update this policy from time to time. Changes will be posted on this page with an updated revision date.
            </Section>
            <p className="text-sm text-charcoal/40">Last updated: January 2025</p>
          </div>
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
