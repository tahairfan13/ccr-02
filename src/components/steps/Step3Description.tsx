"use client";

import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Target, Zap, Lightbulb } from "lucide-react";

interface Step3Props {
  description: string;
  onDescriptionChange: (description: string) => void;
}

export default function Step3Description({ description, onDescriptionChange }: Step3Props) {
  const wordCount = description.trim().split(/\s+/).filter(Boolean).length;
  const charCount = description.length;
  const minWords = 10;
  const isValid = wordCount >= minWords;

  return (
    <div className="w-full max-w-4xl mx-auto px-5 py-2 md:py-0">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-4 md:mb-10"
      >
        <p className="text-sm text-neutral-500 font-semibold mb-2 hidden md:block">03 &mdash; Description</p>
        <h2 className="text-xl md:text-[32px] font-semibold text-neutral-900 leading-tight mb-2 md:mb-3">
          Describe your project
        </h2>
        <p className="text-sm md:text-base text-neutral-600 max-w-xl">
          Our AI analyses your description to generate tailored features and an accurate cost breakdown.
        </p>
        <p className="text-xs text-neutral-500 mt-1.5">
          Even a brief description works — our AI fills in the details
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Textarea card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-2"
        >
          <div className="rounded-2xl bg-white shadow-[0_1px_3px_0_rgba(0,0,0,0.04),0_0_0_1px_rgba(0,0,0,0.02)] p-5 md:p-7">
            <Textarea
              id="description"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="I want to build a mobile app that helps users track workouts and connect with friends. It should have user profiles, push notifications, and integrate with Apple Health..."
              className="min-h-[120px] md:min-h-[280px] resize-none border-0 p-0 bg-white focus:bg-white focus:ring-0 focus-visible:ring-0 focus:shadow-none shadow-none text-sm md:text-base text-neutral-700 placeholder:text-neutral-400"
            />

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-100">
              <div className="flex items-center gap-4 text-xs text-neutral-500">
                <span className={charCount > 2000 ? "text-[#ED1A3B]" : ""}>
                  {charCount}/2000
                </span>
                <span className={isValid ? "text-emerald-600" : ""}>
                  {wordCount} words {!isValid && `(min ${minWords})`}
                </span>
              </div>

              {isValid && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1.5 text-xs font-medium text-emerald-600"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="hidden md:inline">Ready for AI analysis</span>
                  <span className="md:hidden">Ready</span>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tips sidebar — desktop only */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="lg:col-span-1 space-y-4 hidden lg:block"
        >
          <div className="rounded-2xl bg-[#f7f7f6] p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-neutral-900 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-white" strokeWidth={2} />
              </div>
              <span className="text-sm font-semibold text-neutral-900">Tips for better results</span>
            </div>
            <ul className="space-y-3 text-sm text-neutral-600">
              <li className="flex items-start gap-2.5">
                <Target className="w-4 h-4 text-neutral-500 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <span>Define your target audience and main goals</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Zap className="w-4 h-4 text-neutral-500 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <span>List key features and functionality</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-neutral-500 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <span>Mention any third-party integrations</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl bg-[#f7f7f6] p-5">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Good example</p>
            <p className="text-xs text-neutral-600 leading-relaxed italic">
              &ldquo;A B2B SaaS platform for project management with team collaboration, task tracking, Gantt charts, time logging, client portals, Slack integration, and custom reporting dashboards.&rdquo;
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
