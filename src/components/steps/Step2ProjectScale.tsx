"use client";

import { motion } from "framer-motion";
import type { ProjectScale } from "@/types";
import { Rocket, TrendingUp, Clock, Check } from "lucide-react";

interface ScaleOption {
  scale: ProjectScale;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  timeline: string;
  bestFor: string;
  budget: string;
  recommended?: boolean;
}

const scaleOptions: ScaleOption[] = [
  {
    scale: "mvp",
    title: "MVP",
    description: "Minimum Viable Product",
    icon: <Rocket className="w-6 h-6" strokeWidth={1.5} />,
    features: [
      "Core features only",
      "Basic UI/UX design",
      "Essential functionality",
      "Quick time to market",
    ],
    timeline: "2–4 months",
    bestFor: "Startups validating ideas, proof of concepts, quick market entry",
    budget: "£4,000 – £30,000",
    recommended: true,
  },
  {
    scale: "mid",
    title: "Growth Ready",
    description: "Scale-Ready Application",
    icon: <TrendingUp className="w-6 h-6" strokeWidth={1.5} />,
    features: [
      "Extended feature set",
      "Custom UI/UX design",
      "Third-party integrations",
      "Scalable architecture",
    ],
    timeline: "4–8 months",
    bestFor: "Growing businesses, established products, competitive markets",
    budget: "£40,000 – £120,000",
  },
];

interface Step2Props {
  selectedScale: ProjectScale | null;
  onSelectScale: (scale: ProjectScale) => void;
}

export default function Step2ProjectScale({ selectedScale, onSelectScale }: Step2Props) {
  return (
    <div className="w-full max-w-4xl mx-auto px-5 py-2 md:py-0">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-4 md:mb-10"
      >
        <p className="text-sm text-neutral-500 font-semibold mb-2 hidden md:block">02 &mdash; Project Scale</p>
        <h2 className="text-xl md:text-[32px] font-semibold text-neutral-900 leading-tight mb-2 md:mb-3">
          Choose your project scope
        </h2>
        <p className="text-sm md:text-base text-neutral-600 max-w-xl">
          Select the development scope that matches your goals and timeline
        </p>
        <p className="text-xs text-neutral-500 mt-1.5">
          This helps us tailor your cost report accurately
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-5">
        {scaleOptions.map((option, index) => {
          const isSelected = selectedScale === option.scale;

          return (
            <motion.button
              key={option.scale}
              type="button"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.06 }}
              onClick={() => onSelectScale(option.scale)}
              className={`
                group relative text-left rounded-2xl p-5 md:p-8 transition-all duration-200 cursor-pointer
                ${isSelected
                  ? "bg-white shadow-[0_4px_24px_-2px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.04)]"
                  : "bg-[#f7f7f6] hover:bg-white hover:shadow-[0_2px_16px_-2px_rgba(0,0,0,0.08)]"
                }
              `}
            >
              {/* Recommended badge */}
              {option.recommended && (
                <span className="absolute -top-2.5 right-3 px-2.5 py-0.5 bg-[#ED1A3B] text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                  Recommended
                </span>
              )}

              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 w-6 h-6 rounded-full bg-neutral-900 flex items-center justify-center"
                >
                  <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                </motion.div>
              )}

              {/* Icon + Title */}
              <div className="flex items-start gap-4 mb-5">
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200
                  ${isSelected ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600 group-hover:bg-neutral-200"}
                `}>
                  {option.icon}
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <h3 className="text-base md:text-lg font-semibold text-neutral-900">
                    {option.title}
                  </h3>
                  <p className="text-xs md:text-sm text-neutral-600">
                    {option.description}
                  </p>
                </div>
              </div>

              {/* Budget — prominent */}
              <div className={`text-lg md:text-xl font-semibold mb-4 transition-colors duration-200 ${isSelected ? "text-[#ED1A3B]" : "text-neutral-900"}`}>
                {option.budget}
              </div>

              {/* Timeline */}
              <div className="flex items-center gap-1.5 text-sm text-neutral-600 mb-4">
                <Clock className="w-3.5 h-3.5 text-neutral-500" strokeWidth={2} />
                <span>{option.timeline} typical delivery</span>
              </div>

              {/* Best For */}
              <div className="mb-5 p-3 rounded-xl bg-neutral-100/60">
                <p className="text-[10px] md:text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
                  Best For
                </p>
                <p className="text-xs md:text-sm text-neutral-700 leading-relaxed">
                  {option.bestFor}
                </p>
              </div>

              {/* Features */}
              <div className="space-y-2.5">
                {option.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <Check className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? "text-[#ED1A3B]" : "text-neutral-400"}`} strokeWidth={2.5} />
                    <span className="text-xs md:text-sm text-neutral-700">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
