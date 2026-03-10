"use client";

import { useEffect, useRef, useState } from "react";

interface StatItem {
  value: number;
  prefix?: string;
  suffix: string;
  label: string;
}

const stats: StatItem[] = [
  { value: 80, suffix: "+", label: "Projects delivered" },
  { value: 10, suffix: "+", label: "Countries served" },
  { value: 370, suffix: "+", label: "Estimates generated" },
  { value: 2, prefix: "£", suffix: "M+", label: "Estimated via calculator" },
];

function Counter({ value, prefix, suffix, label }: StatItem) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1400;
          const startTime = performance.now();

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * value));
            if (progress < 1) requestAnimationFrame(animate);
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center">
      <p className="text-2xl md:text-4xl font-semibold text-neutral-900 tabular-nums">
        {prefix}{count}{suffix}
      </p>
      <p className="text-[11px] md:text-sm text-neutral-500 mt-1">{label}</p>
    </div>
  );
}

export default function AnimatedStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
      {stats.map((stat) => (
        <Counter key={stat.label} {...stat} />
      ))}
    </div>
  );
}
