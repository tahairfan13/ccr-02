"use client";

import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Sparkles, FileText, Lightbulb, Target, Zap } from "lucide-react";

interface Step3Props {
  description: string;
  onDescriptionChange: (description: string) => void;
}

export default function Step3Description({
  description,
  onDescriptionChange,
}: Step3Props) {
  const wordCount = description.trim().split(/\s+/).filter(Boolean).length;
  const charCount = description.length;
  const minWords = 10;
  const isValid = wordCount >= minWords;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-2 md:py-0">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-3 md:mb-12"
      >
        <div className="hidden md:inline-block px-3 py-1 rounded-md bg-gray-100 text-gray-600 text-sm font-medium mb-4">
          Step 3 of 5
        </div>
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-2 md:mb-3">
          Describe Your Project
        </h2>
        <p className="text-sm md:text-base text-gray-600 font-normal max-w-2xl">
          Tell us about your vision. Our AI will analyze your description to generate tailored features and cost estimates.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-6">
        {/* Main Description Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="border-gray-200 hover:border-gray-300 transition-all duration-200">
            <div className="p-4 md:p-7">
              <div>
                <label
                  htmlFor="description"
                  className="flex items-center gap-2 text-xs md:text-sm font-semibold text-gray-900 mb-2 md:mb-3"
                >
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-[#ed1a3b] to-[#d11632] flex items-center justify-center">
                    <FileText className="w-3 h-3 md:w-4 md:h-4 text-white" strokeWidth={2} />
                  </div>
                  Project Details
                </label>

                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => onDescriptionChange(e.target.value)}
                  placeholder="Example: I want to build a mobile fitness app that helps users track workouts, monitor nutrition, and connect with friends..."
                  className="min-h-[120px] md:min-h-[280px] resize-none border-gray-200 focus:border-[#ed1a3b] focus:ring-1 focus:ring-[#ed1a3b] transition-all rounded-lg"
                />

                <div className="flex items-center justify-between mt-2 md:mt-4 pt-2 md:pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm">
                    <span className={`font-medium ${charCount > 2000 ? "text-red-600" : "text-gray-500"}`}>
                      {charCount} / 2000
                    </span>
                    <span className={`font-medium ${isValid ? "text-green-600" : "text-gray-500"}`}>
                      {wordCount} words {!isValid && `(min ${minWords})`}
                    </span>
                  </div>

                  {isValid && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-semibold text-green-600"
                    >
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-600 animate-pulse" />
                      <span className="hidden md:inline">Ready for AI</span>
                      <span className="md:hidden">Ready</span>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Tips Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="lg:col-span-1 space-y-3 md:space-y-4 hidden lg:block"
        >
          {/* AI Tips Card */}
          <Card className="border-blue-200 bg-blue-50/50">
            <div className="p-4 md:p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0094ED] to-[#0070bd] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" strokeWidth={2} />
                </div>
                <h4 className="font-bold text-sm text-gray-900">AI Tips</h4>
              </div>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <Target className="w-4 h-4 text-[#0094ED] mt-0.5 flex-shrink-0" strokeWidth={2} />
                  <span>Define your target audience and main goals</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-4 h-4 text-[#0094ED] mt-0.5 flex-shrink-0" strokeWidth={2} />
                  <span>List key features and functionality</span>
                </li>
                <li className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-[#0094ED] mt-0.5 flex-shrink-0" strokeWidth={2} />
                  <span>Mention any third-party integrations</span>
                </li>
              </ul>
            </div>
          </Card>

          {/* Example Card */}
          <Card className="border-gray-200">
            <div className="p-5">
              <h4 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-[#ed1a3b]" strokeWidth={2} />
                Good Example
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                "A B2B SaaS platform for project management with team collaboration, task tracking, Gantt charts, time logging, client portals, Slack integration, and custom reporting dashboards."
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
