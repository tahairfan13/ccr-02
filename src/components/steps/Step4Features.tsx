"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Feature } from "@/types";
import { Card } from "@/components/ui/card";
import { Sparkles, Clock, Loader2, CheckCircle2, Package } from "lucide-react";
import { useMemo } from "react";

interface Step4Props {
  features: Feature[];
  onToggleFeature: (featureId: string) => void;
  isLoading: boolean;
}

export default function Step4Features({
  features,
  onToggleFeature,
  isLoading,
}: Step4Props) {
  const stats = useMemo(() => {
    const selectedFeatures = features.filter((f) => f.selected);
    const totalHours = selectedFeatures.reduce((sum, f) => sum + f.hours, 0);
    const estimatedCost = totalHours * 30; // $30 per hour

    // Group features by category
    const categories = features.reduce((acc, feature) => {
      const category = feature.category || "Other";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(feature);
      return acc;
    }, {} as Record<string, Feature[]>);

    return {
      selectedCount: selectedFeatures.length,
      totalCount: features.length,
      totalHours,
      estimatedCost,
      categories,
    };
  }, [features]);

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center min-h-[500px] text-center"
        >
          <div className="relative mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-16 h-16 text-primary" />
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-primary/20 rounded-full blur-xl"
            />
          </div>

          <h3 className="text-2xl font-bold mb-3">
            Analyzing your project with AI...
          </h3>
          <p className="text-muted-foreground max-w-md">
            Our AI is carefully examining your requirements to generate a
            detailed feature list with time estimates
          </p>

          <div className="mt-8 space-y-2">
            {[
              "Understanding project scope",
              "Identifying key features",
              "Calculating time estimates",
            ].map((text, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.3 }}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                {text}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-2 md:py-0">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-3 md:mb-12"
      >
        <div className="hidden md:inline-block px-3 py-1 rounded-md bg-gray-100 text-gray-600 text-sm font-medium mb-4">
          Step 5 of 5
        </div>
        <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
          <h2 className="text-lg md:text-3xl font-bold text-gray-900">
            AI-Generated Features & Cost Estimate
          </h2>
          <CheckCircle2 className="w-5 h-5 md:w-7 md:h-7 text-green-600" strokeWidth={2} />
        </div>
        <p className="text-sm md:text-base text-gray-600 font-normal max-w-2xl">
          Review and select the features you want to include in your project
        </p>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-3 gap-2 md:gap-5 mb-4 md:mb-8"
      >
        <Card className="p-3 md:p-6 border-red-200 bg-red-50/50">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br from-[#ed1a3b] to-[#d11632] flex items-center justify-center shadow-md">
              <Package className="w-3 h-3 md:w-5 md:h-5 text-white" strokeWidth={2} />
            </div>
            <div>
              <p className="text-[10px] md:text-sm text-gray-600 font-medium">Selected</p>
              <p className="text-sm md:text-2xl font-bold text-gray-900">
                {stats.selectedCount}/{stats.totalCount}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-3 md:p-6 border-blue-200 bg-blue-50/50">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br from-[#0094ED] to-[#0070bd] flex items-center justify-center shadow-md">
              <Clock className="w-3 h-3 md:w-5 md:h-5 text-white" strokeWidth={2} />
            </div>
            <div>
              <p className="text-[10px] md:text-sm text-gray-600 font-medium">Hours</p>
              <p className="text-sm md:text-2xl font-bold text-gray-900">{stats.totalHours}h</p>
            </div>
          </div>
        </Card>

        <Card className="p-3 md:p-6 border-green-200 bg-green-50/50">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
              <span className="text-sm md:text-xl font-bold text-white">$</span>
            </div>
            <div>
              <p className="text-[10px] md:text-sm text-gray-600 font-medium">Cost</p>
              <p className="text-sm md:text-2xl font-bold text-gray-900">
                ${stats.estimatedCost.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Features by Category */}
      <div className="space-y-3 md:space-y-6">
        {Object.entries(stats.categories).map(([category, categoryFeatures], categoryIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + categoryIndex * 0.1 }}
          >
            <h3 className="text-base md:text-xl font-bold text-gray-900 mb-2 md:mb-4 flex items-center gap-2">
              <div className="w-1 h-4 md:h-6 bg-gradient-to-b from-[#ed1a3b] to-[#d11632] rounded-full" />
              {category}
            </h3>

            <div className="space-y-2 md:space-y-3">
              <AnimatePresence>
                {categoryFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      className={`
                        p-3 md:p-5 cursor-pointer transition-all duration-200
                        hover:shadow-md
                        ${
                          feature.selected
                            ? "bg-red-50 border-[#ed1a3b] border-2 shadow-lg"
                            : "border-gray-200 hover:border-gray-300"
                        }
                      `}
                      onClick={() => onToggleFeature(feature.id)}
                    >
                      <div className="flex items-start justify-between gap-2 md:gap-4 mb-1 md:mb-2">
                        <h4 className="font-bold text-sm md:text-base text-gray-900">
                          {feature.name}
                        </h4>
                        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0 px-2 md:px-2.5 py-0.5 md:py-1 rounded-md bg-blue-50">
                          <Clock className="w-3 h-3 md:w-4 md:h-4 text-[#0094ED]" strokeWidth={2} />
                          <span className="text-xs md:text-sm font-semibold text-[#0094ED]">
                            {feature.hours}h
                          </span>
                        </div>
                      </div>
                      <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>

      {features.length === 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-muted-foreground">
            No features generated yet. Please complete the previous steps.
          </p>
        </motion.div>
      )}
    </div>
  );
}
