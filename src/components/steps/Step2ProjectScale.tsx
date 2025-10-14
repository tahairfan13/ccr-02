"use client";

import { motion } from "framer-motion";
import { ProjectScale } from "@/types";
import { Rocket, TrendingUp, Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ScaleOption {
  scale: ProjectScale;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  gradient: string;
  timeline: string;
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
      "Cost-effective approach",
    ],
    gradient: "from-green-500 to-emerald-500",
    timeline: "2-4 months",
  },
  {
    scale: "mid",
    title: "Mid-Level",
    description: "Feature-Rich Application",
    icon: <TrendingUp className="w-8 h-8" />,
    features: [
      "Extended feature set",
      "Custom UI/UX design",
      "Third-party integrations",
      "Enhanced user experience",
      "Scalable architecture",
    ],
    gradient: "from-blue-500 to-cyan-500",
    timeline: "4-8 months",
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
      "High security standards",
      "Enterprise-grade infrastructure",
    ],
    gradient: "from-purple-500 to-pink-500",
    timeline: "8+ months",
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
    <div className="w-full max-w-6xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 md:mb-12"
      >
        <div className="inline-block px-3 py-1 rounded-md bg-gray-100 text-gray-600 text-sm font-medium mb-4">
          Step 2 of 5
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Select Project Scale
        </h2>
        <p className="text-base text-gray-600 font-normal max-w-2xl">
          Choose the level that best matches your project needs and budget
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {scaleOptions.map((option, index) => {
          const isSelected = selectedScale === option.scale;

          return (
            <motion.div
              key={option.scale}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className={`
                  group relative cursor-pointer transition-all duration-200 h-full
                  hover:shadow-md
                  ${
                    isSelected
                      ? "border-[#ed1a3b] shadow-md bg-red-50/30"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }
                `}
                onClick={() => onSelectScale(option.scale)}
              >
                <div className="p-6 md:p-7 flex flex-col h-full">
                  {/* Icon with gradient background */}
                  <div className="mb-5">
                    <div
                      className={`
                        w-16 h-16 rounded-2xl bg-gradient-to-br ${option.gradient}
                        flex items-center justify-center text-white
                        shadow-lg mb-4 transition-transform duration-200
                        ${isSelected ? "scale-105 shadow-xl" : "group-hover:scale-105"}
                      `}
                    >
                      {option.icon}
                    </div>

                    <div className="mb-2">
                      <h3 className="text-2xl font-bold text-gray-900">{option.title}</h3>
                      <p className="text-sm text-gray-600">
                        {option.description}
                      </p>
                      {isSelected && (
                        <span className="inline-block mt-2 text-xs font-semibold text-[#ed1a3b]">
                          ✓ Selected
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Features list */}
                  <div className="flex-grow mt-4">
                    <ul className="space-y-3">
                      {option.features.map((feature, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 + idx * 0.05 }}
                          className="flex items-start gap-2.5"
                        >
                          <div
                            className={`
                              w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0
                              bg-gradient-to-r ${option.gradient}
                            `}
                          />
                          <span className="text-sm text-gray-600 leading-relaxed">
                            {feature}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
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
