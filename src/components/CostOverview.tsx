"use client";

import { motion } from "framer-motion";
import { Smartphone, Globe, Brain, Blocks } from "lucide-react";

const costRanges = [
  {
    icon: <Smartphone className="w-5 h-5" strokeWidth={1.5} />,
    title: "Mobile Apps",
    subtitle: "iOS, Android, cross-platform",
    range: "£8,000 – £80,000+",
  },
  {
    icon: <Globe className="w-5 h-5" strokeWidth={1.5} />,
    title: "Web Apps",
    subtitle: "SaaS, PWAs, portals",
    range: "£6,000 – £65,000+",
  },
  {
    icon: <Brain className="w-5 h-5" strokeWidth={1.5} />,
    title: "AI / ML",
    subtitle: "NLP, computer vision, analytics",
    range: "£12,000 – £100,000+",
  },
  {
    icon: <Blocks className="w-5 h-5" strokeWidth={1.5} />,
    title: "Blockchain",
    subtitle: "Smart contracts, DeFi, Web3",
    range: "£16,000 – £120,000+",
  },
];

export default function CostOverview() {
  return (
    <section className="w-full px-5 md:px-8 lg:px-12 pb-14 md:pb-20">
      <div className="max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-4 md:mb-5"
        >
          Typical UK cost ranges
        </motion.p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {costRanges.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20px" }}
              transition={{
                duration: 0.45,
                delay: i * 0.08,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="group rounded-2xl bg-[#f7f7f6] p-4 md:p-5 transition-all duration-300 hover:bg-white hover:shadow-[0_2px_20px_-4px_rgba(0,0,0,0.08)]"
            >
              <div className="w-9 h-9 rounded-lg bg-neutral-200/60 flex items-center justify-center mb-3 text-neutral-500 transition-colors duration-300 group-hover:bg-neutral-900 group-hover:text-white">
                {item.icon}
              </div>
              <h3 className="font-semibold text-sm text-neutral-900 mb-0.5">
                {item.title}
              </h3>
              <p className="text-[11px] text-neutral-500 mb-3">
                {item.subtitle}
              </p>
              <p className="text-[13px] md:text-sm font-semibold text-neutral-800">
                {item.range}
              </p>
            </motion.div>
          ))}
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-[11px] text-neutral-400 mt-3 md:mt-4"
        >
          Ranges reflect UK market rates for custom development. Your actual
          cost depends on features, scale, and complexity.
        </motion.p>
      </div>
    </section>
  );
}
