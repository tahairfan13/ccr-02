"use client";

import { motion } from "framer-motion";
import { ProjectScale } from "@/types";
import { Rocket, TrendingUp, Building2, Clock, DollarSign, Users, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ScaleOption {
  scale: ProjectScale;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  gradient: string;
  timeline: string;
  bestFor: string;
  budget: string;
  teamSize: string;
}

const scaleOptions: ScaleOption[] = [
  {
    scale: "mvp",
    title: "MVP",
    description: "Minimum Viable Product",
    icon: <Rocket className="w-8 h-8" />,
    features: [
      "Core features only",
      "Basic UI/UX design",
      "Essential functionality",
      "Quick time to market",
    ],
    gradient: "from-green-500 to-emerald-500",
    timeline: "2-4 months",
    bestFor: "Startups validating ideas, proof of concepts, quick market entry",
    budget: "$5K - $40K",
    teamSize: "Small team (2-4 developers)",
  },
  {
    scale: "mid",
    title: "Mid-Scale",
    description: "Production-Ready Application",
    icon: <TrendingUp className="w-8 h-8" />,
    features: [
      "Extended feature set",
      "Custom UI/UX design",
      "Third-party integrations",
      "Scalable architecture",
    ],
    gradient: "from-blue-500 to-cyan-500",
    timeline: "4-8 months",
    bestFor: "Growing businesses, established products, competitive markets",
    budget: "$50K - $150K",
    teamSize: "Medium team (5-10 developers)",
  },
  {
    scale: "enterprise",
    title: "Enterprise",
    description: "Full-Scale Solution",
    icon: <Building2 className="w-8 h-8" />,
    features: [
      "Complete feature suite",
      "Premium UI/UX design",
      "Advanced integrations",
      "Enterprise-grade security",
    ],
    gradient: "from-purple-500 to-pink-500",
    timeline: "8+ months",
    bestFor: "Large corporations, complex systems, mission-critical applications",
    budget: "$150K+",
    teamSize: "Large team (10+ developers)",
  },
];

interface Step2Props {
  selectedScale: ProjectScale | null;
  onSelectScale: (scale: ProjectScale) => void;
}

export default function Step2ProjectScale({
  selectedScale,
  onSelectScale,
}: Step2Props) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-2 md:py-0">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-3 md:mb-12"
      >
        <div className="hidden md:inline-block px-3 py-1 rounded-md bg-gray-100 text-gray-600 text-sm font-medium mb-4">
          Step 2 of 5
        </div>
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3">
          Select Project Scale
        </h2>
        <p className="text-sm md:text-base text-gray-600 font-normal max-w-2xl">
          Choose the development scope that matches your goals and timeline
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-5">
        {scaleOptions.map((option, index) => {
          const isSelected = selectedScale === option.scale;

          return (
            <motion.div
              key={option.scale}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
            >
              <Card
                className={`
                  group relative cursor-pointer transition-all duration-200
                  hover:shadow-md
                  ${
                    isSelected
                      ? "border-[#ed1a3b] border-2 shadow-lg bg-red-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }
                `}
                onClick={() => onSelectScale(option.scale)}
              >
                <div className="p-4 md:p-6">
                  {/* Icon and Title */}
                  <div className="flex items-start gap-3 md:gap-4 mb-3 md:mb-4">
                    <div
                      className={`
                        w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${option.gradient}
                        flex items-center justify-center text-white flex-shrink-0
                        shadow-lg transition-transform duration-200
                        ${isSelected ? "scale-105 shadow-xl" : "group-hover:scale-105"}
                      `}
                    >
                      <div className="scale-75 md:scale-90">
                        {option.icon}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-base md:text-xl font-bold text-gray-900 mb-1">
                        {option.title}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-600">
                        {option.description}
                      </p>
                    </div>
                  </div>

                  {/* Key Info Badges */}
                  <div className="grid grid-cols-2 gap-2 mb-3 md:mb-4">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Clock className="w-3.5 h-3.5 text-gray-500" strokeWidth={2} />
                      <span className="text-gray-700 font-medium">{option.timeline}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <DollarSign className="w-3.5 h-3.5 text-gray-500" strokeWidth={2} />
                      <span className="text-gray-700 font-medium">{option.budget}</span>
                    </div>
                  </div>

                  {/* Best For */}
                  <div className="mb-3 md:mb-4 p-2.5 md:p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="flex items-start gap-2">
                      <Zap className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#ed1a3b] flex-shrink-0 mt-0.5" strokeWidth={2} />
                      <div>
                        <p className="text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">
                          Best For
                        </p>
                        <p className="text-xs md:text-sm text-gray-700 leading-snug">
                          {option.bestFor}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-1.5 md:space-y-2">
                    {option.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2"
                      >
                        <div
                          className={`
                            w-1 h-1 md:w-1.5 md:h-1.5 rounded-full mt-1.5 md:mt-2 flex-shrink-0
                            bg-gradient-to-r ${option.gradient}
                          `}
                        />
                        <span className="text-xs md:text-sm text-gray-600 leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
