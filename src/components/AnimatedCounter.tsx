import { useEffect, useRef, useState } from 'react';
import { useInView } from './hooks';

interface CounterProps {
  value: number;
  suffix?: string;
  label: string;
}

export default function AnimatedCounter({ value, suffix = '', label }: CounterProps) {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <div ref={ref} className="text-center">
      <p className="font-serif text-4xl md:text-5xl text-gold-400 font-light">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="mt-2 text-xs font-sans uppercase tracking-[0.15em] text-ivory/60">{label}</p>
    </div>
  );
}
