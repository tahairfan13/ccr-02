"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Feature } from "@/types";
import { Sparkles, Clock, Loader2, Check, Package } from "lucide-react";
import { useMemo } from "react";

interface Step4Props {
  features: Feature[];
  onToggleFeature: (featureId: string) => void;
  isLoading: boolean;
}

export default function Step4Features({ features, onToggleFeature, isLoading }: Step4Props) {
  const stats = useMemo(() => {
    const selectedFeatures = features.filter((f) => f.selected);
    const totalHours = selectedFeatures.reduce((sum, f) => sum + f.hours, 0);
    const estimatedCost = totalHours * 30;

    const categories = features.reduce((acc, feature) => {
      const category = feature.category || "Other";
      if (!acc[category]) acc[category] = [];
      acc[category].push(feature);
      return acc;
    }, {} as Record<string, Feature[]>);

    return { selectedCount: selectedFeatures.length, totalCount: features.length, totalHours, estimatedCost, categories };
  }, [features]);

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-5">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center min-h-[400px] text-center"
        >
          <div className="relative mb-8">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
              <Sparkles className="w-12 h-12 text-neutral-300" strokeWidth={1.5} />
            </motion.div>
          </div>
          <h3 className="text-xl md:text-2xl font-semibold text-neutral-900 mb-2">Analyzing your project...</h3>
          <p className="text-sm text-neutral-500 max-w-md mb-8">
            Our AI is examining your requirements to generate a detailed feature list
          </p>
          <div className="space-y-2.5">
            {["Understanding project scope", "Identifying key features", "Calculating time estimates"].map((text, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.3 }}
                className="flex items-center gap-2 text-sm text-neutral-500"
              >
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                {text}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-5 py-2 md:py-0">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-4 md:mb-10"
      >
        <p className="text-sm text-neutral-500 font-semibold mb-2 hidden md:block">04 &mdash; Features</p>
        <h2 className="text-xl md:text-[32px] font-semibold text-neutral-900 leading-tight mb-2 md:mb-3">
          Review your features
        </h2>
        <p className="text-sm md:text-base text-neutral-600 max-w-xl">
          Toggle the features you want included in your report
        </p>
        <p className="text-xs text-neutral-500 mt-1.5">
          Your personalised cost breakdown will be sent to your email and WhatsApp
        </p>
      </motion.div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-10"
      >
        <div className="rounded-2xl bg-[#f7f7f6] p-4 md:p-6">
          <div className="flex items-center gap-2.5 mb-1.5">
            <Package className="w-4 h-4 text-neutral-500" strokeWidth={1.5} />
            <span className="text-[10px] md:text-xs text-neutral-500 font-medium uppercase tracking-wider">Selected</span>
          </div>
          <p className="text-lg md:text-3xl font-semibold text-neutral-900">{stats.selectedCount}<span className="text-neutral-400 text-sm md:text-lg font-normal">/{stats.totalCount}</span></p>
        </div>

        <div className="rounded-2xl bg-[#f7f7f6] p-4 md:p-6">
          <div className="flex items-center gap-2.5 mb-1.5">
            <Clock className="w-4 h-4 text-neutral-500" strokeWidth={1.5} />
            <span className="text-[10px] md:text-xs text-neutral-500 font-medium uppercase tracking-wider">Hours</span>
          </div>
          <p className="text-lg md:text-3xl font-semibold text-neutral-900">{stats.totalHours}<span className="text-neutral-400 text-sm md:text-lg font-normal">h</span></p>
        </div>

        <div className="rounded-2xl bg-[#f7f7f6] p-4 md:p-6">
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="text-xs text-[#ED1A3B] font-bold">£</span>
            <span className="text-[10px] md:text-xs text-neutral-500 font-medium uppercase tracking-wider">Estimated</span>
          </div>
          <p className="text-lg md:text-3xl font-semibold text-[#ED1A3B]">£{stats.estimatedCost.toLocaleString()}</p>
        </div>
      </motion.div>

      {/* Features by category */}
      <div className="space-y-6 md:space-y-8">
        {Object.entries(stats.categories).map(([category, categoryFeatures], categoryIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 + categoryIndex * 0.08 }}
          >
            <h3 className="text-sm md:text-base font-semibold text-neutral-900 mb-3 flex items-center gap-2.5">
              <div className="w-0.5 h-4 bg-neutral-900 rounded-full" />
              {category}
            </h3>

            <div className="space-y-2">
              <AnimatePresence>
                {categoryFeatures.map((feature, index) => (
                  <motion.button
                    type="button"
                    key={feature.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 12 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => onToggleFeature(feature.id)}
                    className={`
                      w-full text-left rounded-xl p-4 md:p-5 transition-all duration-200 cursor-pointer
                      ${feature.selected
                        ? "bg-white shadow-[0_2px_12px_-2px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.03)]"
                        : "bg-[#f7f7f6] hover:bg-white hover:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]"
                      }
                    `}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className={`
                          w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors
                          ${feature.selected ? "bg-neutral-900 border-neutral-900" : "border-neutral-300"}
                        `}>
                          {feature.selected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                        </div>
                        <div>
                          <h4 className="font-medium text-sm md:text-base text-neutral-900 mb-0.5">{feature.name}</h4>
                          <p className="text-xs md:text-sm text-neutral-500 leading-relaxed">{feature.description}</p>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full flex-shrink-0">
                        {feature.hours}h
                      </span>
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>

      {features.length === 0 && !isLoading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <p className="text-neutral-500">No features generated yet. Please complete the previous steps.</p>
        </motion.div>
      )}
    </div>
  );
}
