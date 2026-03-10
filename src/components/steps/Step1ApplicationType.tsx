"use client";

import { motion } from "framer-motion";
import type { ApplicationType } from "@/types";
import { Brain, Blocks, Smartphone, Globe, Check } from "lucide-react";

interface ApplicationTypeOption {
  type: ApplicationType;
  title: string;
  description: string;
  icon: React.ReactNode;
  costRange: string;
  popular?: boolean;
}

const applicationTypes: ApplicationTypeOption[] = [
  {
    type: "ai",
    title: "AI/ML Solutions",
    description: "Machine learning, NLP, computer vision and AI integrations",
    icon: <Brain className="w-6 h-6" strokeWidth={1.5} />,
    costRange: "£12,000 – £100,000+",
  },
  {
    type: "blockchain",
    title: "Blockchain",
    description: "Smart contracts, DeFi, NFTs and Web3 applications",
    icon: <Blocks className="w-6 h-6" strokeWidth={1.5} />,
    costRange: "£16,000 – £120,000+",
  },
  {
    type: "mobile",
    title: "Mobile Apps",
    description: "iOS, Android and cross-platform mobile applications",
    icon: <Smartphone className="w-6 h-6" strokeWidth={1.5} />,
    costRange: "£8,000 – £80,000+",
    popular: true,
  },
  {
    type: "web",
    title: "Web Applications",
    description: "Progressive web apps, SaaS platforms and websites",
    icon: <Globe className="w-6 h-6" strokeWidth={1.5} />,
    costRange: "£6,000 – £65,000+",
  },
];

interface Step1Props {
  selectedTypes: ApplicationType[];
  onSelectType: (types: ApplicationType[]) => void;
}

export default function Step1ApplicationType({ selectedTypes, onSelectType }: Step1Props) {
  const toggleType = (type: ApplicationType) => {
    if (selectedTypes.includes(type)) {
      onSelectType(selectedTypes.filter((t) => t !== type));
    } else {
      onSelectType([...selectedTypes, type]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-5 py-2 md:py-0">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-4 md:mb-10"
      >
        <p className="text-sm text-neutral-500 font-semibold mb-2 hidden md:block">01 &mdash; Application Type</p>
        <h2 className="text-xl md:text-[32px] font-semibold text-neutral-900 leading-tight mb-2 md:mb-3">
          What are you building?
        </h2>
        <p className="text-sm md:text-base text-neutral-600 max-w-xl">
          Select one or more — you can combine app types
        </p>
        <p className="text-xs text-neutral-500 mt-1.5">
          Complete in 2 minutes — get your personalised report by email and WhatsApp
        </p>
        {selectedTypes.length > 0 && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-[#ED1A3B] font-medium mt-2"
          >
            {selectedTypes.length} selected
          </motion.p>
        )}
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        {applicationTypes.map((option, index) => {
          const isSelected = selectedTypes.includes(option.type);

          return (
            <motion.button
              key={option.type}
              type="button"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.06 }}
              onClick={() => toggleType(option.type)}
              className={`
                group relative text-left rounded-2xl p-5 md:p-7 transition-all duration-200 cursor-pointer
                ${isSelected
                  ? "bg-white shadow-[0_4px_24px_-2px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.04)]"
                  : "bg-[#f7f7f6] hover:bg-white hover:shadow-[0_2px_16px_-2px_rgba(0,0,0,0.08)]"
                }
              `}
            >
              {/* Popular badge */}
              {option.popular && (
                <span className="absolute -top-2.5 right-3 px-2.5 py-0.5 bg-[#ED1A3B] text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                  Popular
                </span>
              )}

              {/* Selected checkmark */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-4 right-4 w-6 h-6 rounded-full bg-neutral-900 flex items-center justify-center"
                >
                  <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                </motion.div>
              )}

              <div className="flex items-start gap-4">
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-200
                  ${isSelected ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600 group-hover:bg-neutral-200"}
                `}>
                  {option.icon}
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <h3 className="text-base md:text-lg font-semibold text-neutral-900 mb-1">
                    {option.title}
                  </h3>
                  <p className="text-xs md:text-sm text-neutral-600 leading-relaxed mb-2">
                    {option.description}
                  </p>
                  <p className={`text-[13px] font-semibold transition-colors duration-200 ${isSelected ? "text-[#ED1A3B]" : "text-neutral-800"}`}>
                    {option.costRange}
                  </p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
