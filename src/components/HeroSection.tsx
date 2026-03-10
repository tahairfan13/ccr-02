"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import TopGlow from "@/components/TopGlow";

const pills = [
  "Instant detailed report",
  "Sent to email & WhatsApp",
  "370+ estimates generated",
];

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden">
      <TopGlow />
      <div className="relative w-full px-5 md:px-8 lg:px-12 pt-12 pb-10 md:pt-24 md:pb-16">
        <motion.div
          className="max-w-5xl mx-auto"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {/* Category label */}
          <motion.p
            variants={fadeUp}
            className="text-xs font-bold text-[#ED1A3B] uppercase tracking-[0.15em] mb-4 md:mb-5"
          >
            App Development Cost Calculator
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="text-[28px] sm:text-4xl lg:text-[56px] font-semibold text-neutral-900 mb-4 md:mb-5 tracking-[-0.5px] leading-[1.08] max-w-3xl"
          >
            How Much Does It Cost{" "}
            <br className="hidden sm:block" />
            to Build an App?
          </motion.h1>

          <motion.h2
            variants={fadeUp}
            className="text-base md:text-lg text-neutral-600 font-normal mb-5 md:mb-6 max-w-2xl leading-relaxed"
          >
            Get a free, personalised cost report for iOS, Android, or web
            apps — delivered to your email and WhatsApp in minutes.
          </motion.h2>

          {/* SEO body — desktop only */}
          <motion.p
            variants={fadeUp}
            className="hidden md:block text-sm text-neutral-500 leading-relaxed max-w-3xl mb-7"
          >
            Building an app in the UK typically costs between £10,000 and
            £150,000+ depending on the type, platform, and features. The cost
            to develop an app varies based on whether you need iOS, Android,
            or a web app, the complexity of features, and whether you use a
            freelancer, an agency, or a dedicated development company like
            Tecaudex. Complete our 2-minute calculator to get a personalised
            cost breakdown and project roadmap sent directly to your inbox.
          </motion.p>

          {/* Primary CTA */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6 md:mb-7"
          >
            <Link
              href="/calculate"
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 md:px-8 md:py-4 text-sm md:text-base font-semibold text-white bg-[#ED1A3B] hover:bg-[#c71432] rounded-full transition-all duration-200 shadow-[0_2px_12px_-2px_rgba(237,26,59,0.45)] hover:shadow-[0_4px_20px_-2px_rgba(237,26,59,0.5)] hover:-translate-y-px"
            >
              Calculate Your App Cost
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2} />
            </Link>
            <span className="text-xs text-neutral-500">
              Free · 2 minutes · No signup
            </span>
          </motion.div>

          {/* Micro-pills */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center gap-2 md:gap-3"
          >
            {pills.map((pill) => (
              <span
                key={pill}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-50 text-neutral-600 text-xs font-medium border border-neutral-100"
              >
                <Check className="w-3 h-3 text-neutral-400" strokeWidth={3} />
                {pill}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
