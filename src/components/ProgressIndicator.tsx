"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const steps = [
  { number: 1, title: "Type" },
  { number: 2, title: "Scale" },
  { number: 3, title: "Description" },
  { number: 4, title: "Features" },
  { number: 5, title: "Contact" },
];

interface ProgressIndicatorProps {
  currentStep: number;
}

export default function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto px-5 py-3 md:py-10 flex-shrink-0">
      {/* Mobile: minimal bar */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-semibold text-neutral-900">
              {steps[currentStep - 1].title}
            </span>
          </div>
          <span className="text-xs font-medium text-neutral-500">
            {currentStep} of {steps.length}
          </span>
        </div>
        <div className="w-full h-1 bg-neutral-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#ED1A3B] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Desktop: step dots with line */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between relative">
          {/* Background line */}
          <div className="absolute top-[15px] left-[10%] right-[10%] h-px bg-neutral-100" />

          {/* Progress line */}
          <motion.div
            className="absolute top-[15px] left-[10%] h-px bg-neutral-900"
            style={{ originX: 0 }}
            initial={{ width: 0 }}
            animate={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 80}%`,
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />

          {steps.map((step) => {
            const isCompleted = currentStep > step.number;
            const isCurrent = currentStep === step.number;

            return (
              <div key={step.number} className="flex flex-col items-center relative z-10 flex-1">
                <div
                  className={`
                    flex items-center justify-center rounded-full transition-all duration-300
                    ${isCompleted
                      ? "w-[30px] h-[30px] bg-neutral-900"
                      : isCurrent
                        ? "w-[30px] h-[30px] bg-neutral-200 ring-4 ring-white"
                        : "w-[30px] h-[30px] bg-neutral-100 ring-4 ring-white"
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                  ) : (
                    <span className={`text-xs font-semibold ${isCurrent ? "text-neutral-900" : "text-neutral-500"}`}>
                      {step.number}
                    </span>
                  )}
                </div>
                <span
                  className={`mt-2.5 text-[11px] font-medium tracking-wide ${
                    isCurrent ? "text-neutral-900" : isCompleted ? "text-neutral-600" : "text-neutral-500"
                  }`}
                >
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
