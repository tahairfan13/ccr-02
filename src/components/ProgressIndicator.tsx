"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface Step {
  number: number;
  title: string;
}

const steps: Step[] = [
  { number: 1, title: "Type" },
  { number: 2, title: "Scale" },
  { number: 3, title: "Description" },
  { number: 4, title: "Contact" },
  { number: 5, title: "Features" },
];

interface ProgressIndicatorProps {
  currentStep: number;
}

export default function ProgressIndicator({
  currentStep,
}: ProgressIndicatorProps) {
  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-3 md:py-8 flex-shrink-0 bg-white md:bg-transparent border-b md:border-b-0 border-gray-100">
      {/* Mobile Progress Bar */}
      <div className="md:hidden mb-1">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ed1a3b] to-[#d11632] flex items-center justify-center shadow-sm">
              <span className="text-xs font-bold text-white">{currentStep}</span>
            </div>
            <div>
              <span className="text-xs font-bold text-gray-900 block">
                {steps[currentStep - 1].title}
              </span>
              <span className="text-[10px] text-gray-500">
                Step {currentStep} of {steps.length}
              </span>
            </div>
          </div>
          <span className="text-xs font-bold text-[#ed1a3b] bg-red-50 px-2.5 py-1 rounded-full">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
          <motion.div
            className="h-full bg-gradient-to-r from-[#ed1a3b] to-[#d11632] rounded-full relative"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <motion.div
              className="absolute inset-0 bg-white/30"
              animate={{
                x: ['-100%', '100%']
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Desktop Stepper */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between relative">
          {/* Background Line */}
          <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200" />

          {/* Progress Line */}
          <motion.div
            className="absolute top-5 left-0 h-0.5 bg-[#ed1a3b]"
            initial={{ width: 0 }}
            animate={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />

          {steps.map((step) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;

            return (
              <div
                key={step.number}
                className="flex flex-col items-center relative z-10 flex-1"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    transition-all duration-200 border-2
                    ${
                      isCompleted || isCurrent
                        ? "bg-[#ed1a3b] border-[#ed1a3b] text-white"
                        : "bg-white border-gray-300 text-gray-400"
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" strokeWidth={2.5} />
                  ) : (
                    <span className="text-sm font-semibold">{step.number}</span>
                  )}
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`
                    mt-2 text-xs font-medium
                    ${
                      isCurrent || isCompleted
                        ? "text-gray-900"
                        : "text-gray-400"
                    }
                  `}
                >
                  {step.title}
                </motion.p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
