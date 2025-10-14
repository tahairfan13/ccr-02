"use client";

import { motion } from "framer-motion";
import { ApplicationType } from "@/types";
import { Brain, Blocks, Smartphone, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ApplicationTypeOption {
  type: ApplicationType;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  bgColor: string;
}

const applicationTypes: ApplicationTypeOption[] = [
  {
    type: "ai",
    title: "AI/ML Solutions",
    description: "Machine learning, NLP, computer vision and AI integrations",
    icon: <Brain className="w-7 h-7" strokeWidth={2} />,
    gradient: "from-purple-500 via-purple-600 to-indigo-600",
    bgColor: "bg-purple-50",
  },
  {
    type: "blockchain",
    title: "Blockchain",
    description: "Smart contracts, DeFi, NFTs and Web3 applications",
    icon: <Blocks className="w-7 h-7" strokeWidth={2} />,
    gradient: "from-blue-500 via-blue-600 to-cyan-600",
    bgColor: "bg-blue-50",
  },
  {
    type: "mobile",
    title: "Mobile Apps",
    description: "iOS, Android and cross-platform mobile applications",
    icon: <Smartphone className="w-7 h-7" strokeWidth={2} />,
    gradient: "from-emerald-500 via-green-600 to-teal-600",
    bgColor: "bg-emerald-50",
  },
  {
    type: "web",
    title: "Web Applications",
    description: "Progressive web apps, SaaS platforms and websites",
    icon: <Globe className="w-7 h-7" strokeWidth={2} />,
    gradient: "from-orange-500 via-red-500 to-pink-600",
    bgColor: "bg-orange-50",
  },
];

interface Step1Props {
  selectedTypes: ApplicationType[];
  onSelectType: (types: ApplicationType[]) => void;
}

export default function Step1ApplicationType({
  selectedTypes,
  onSelectType,
}: Step1Props) {
  const toggleType = (type: ApplicationType) => {
    if (selectedTypes.includes(type)) {
      onSelectType(selectedTypes.filter((t) => t !== type));
    } else {
      onSelectType([...selectedTypes, type]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 md:mb-12"
      >
        <div className="inline-block px-3 py-1 rounded-md bg-gray-100 text-gray-600 text-sm font-medium mb-4">
          Step 1 of 5
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
          Select Application Type
        </h2>
        <p className="text-base text-gray-600 font-normal max-w-2xl">
          Choose one or more application types for your project
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
        {applicationTypes.map((option, index) => {
          const isSelected = selectedTypes.includes(option.type);

          return (
            <motion.div
              key={option.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.08,
              }}
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
                onClick={() => toggleType(option.type)}
              >
                <div className="p-6 md:p-7">
                  <div className="flex items-start gap-5 mb-4">
                    {/* Colorful Icon */}
                    <div
                      className={`
                        w-16 h-16 rounded-2xl bg-gradient-to-br ${option.gradient}
                        flex items-center justify-center text-white flex-shrink-0
                        shadow-lg transition-transform duration-200
                        ${isSelected ? "scale-105 shadow-xl" : "group-hover:scale-105"}
                      `}
                    >
                      {option.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pt-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                        {option.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {option.description}
                      </p>
                    </div>
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
