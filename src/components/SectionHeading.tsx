import { useInView } from './hooks';

interface SectionHeadingProps {
  label?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  light?: boolean;
}

export default function SectionHeading({ label, title, subtitle, center, light }: SectionHeadingProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`${center ? 'text-center mx-auto max-w-2xl' : 'max-w-2xl'} transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
    >
      {label && <span className="section-label">{label}</span>}
      <h2 className={`heading-2 ${light ? '!text-ivory' : ''}`}>{title}</h2>
      {subtitle && (
        <p className={`mt-4 text-body ${light ? '!text-ivory/70' : ''}`}>{subtitle}</p>
      )}
    </div>
  );
}
