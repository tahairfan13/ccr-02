"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Blocks, Smartphone, Globe, ArrowRight, Check } from "lucide-react";
import Link from "next/link";

interface AppTypePreview {
  type: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  costRange: string;
  popular?: boolean;
}

const appTypes: AppTypePreview[] = [
  {
    type: "ai",
    title: "AI/ML Solutions",
    description: "Machine learning, NLP, computer vision",
    icon: <Brain className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />,
    features: ["Natural Language Processing", "Computer Vision", "Recommendation Engine", "Predictive Analytics"],
    costRange: "£12,000 – £100,000+",
  },
  {
    type: "blockchain",
    title: "Blockchain",
    description: "Smart contracts, DeFi, NFTs, Web3",
    icon: <Blocks className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />,
    features: ["Smart Contracts", "Token Integration", "Wallet Connect", "DeFi Protocols"],
    costRange: "£16,000 – £120,000+",
  },
  {
    type: "mobile",
    title: "Mobile Apps",
    description: "iOS, Android, cross-platform",
    icon: <Smartphone className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />,
    features: ["Push Notifications", "Offline Mode", "In-App Payments", "Device APIs"],
    costRange: "£8,000 – £80,000+",
    popular: true,
  },
  {
    type: "web",
    title: "Web Apps",
    description: "SaaS platforms, PWAs, portals",
    icon: <Globe className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />,
    features: ["User Dashboard", "API Integrations", "Real-time Updates", "Admin Panel"],
    costRange: "£6,000 – £65,000+",
  },
];

export default function LandingPreview() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedType = appTypes.find((t) => t.type === selected);

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {appTypes.map((app, index) => {
          const isActive = selected === app.type;

          return (
            <motion.button
              key={app.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              onClick={() => setSelected(isActive ? null : app.type)}
              className={`
                group relative text-left rounded-2xl p-4 md:p-5 transition-all duration-200 cursor-pointer
                ${isActive
                  ? "bg-white shadow-[0_4px_24px_-2px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.04)]"
                  : "bg-[#f7f7f6] hover:bg-white hover:shadow-[0_2px_16px_-2px_rgba(0,0,0,0.08)]"
                }
              `}
            >
              {/* Popular badge */}
              {app.popular && (
                <span className="absolute -top-2.5 right-3 px-2.5 py-0.5 bg-[#ED1A3B] text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
                  Popular
                </span>
              )}

              <div className={`
                w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center mb-3 transition-colors duration-200
                ${isActive ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-500 group-hover:bg-neutral-200 group-hover:text-neutral-700"}
              `}>
                {app.icon}
              </div>

              <h3 className="font-semibold text-sm md:text-base text-neutral-900 mb-0.5">{app.title}</h3>
              <p className="text-[11px] md:text-xs text-neutral-500 leading-relaxed mb-3">{app.description}</p>

              {/* Cost range — always visible */}
              <p className={`text-[13px] md:text-base font-semibold transition-colors duration-200 ${isActive ? "text-[#ED1A3B]" : "text-neutral-800 group-hover:text-[#ED1A3B]"}`}>
                {app.costRange}
              </p>

              <p className={`text-[11px] mt-2 font-medium transition-colors duration-200 ${isActive ? "text-[#ED1A3B]" : "text-neutral-500"}`}>
                {isActive ? "Selected" : "Explore →"}
              </p>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {selectedType && (
          <motion.div
            key={selectedType.type}
            initial={{ opacity: 0, y: 8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-5 rounded-2xl bg-white shadow-[0_2px_16px_-2px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.02)] p-5 md:p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5 md:gap-10">
                <div className="flex-1">
                  <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider mb-3">
                    Typical features for {selectedType.title}
                  </p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {selectedType.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[#ED1A3B] flex-shrink-0" strokeWidth={2.5} />
                        <span className="text-sm text-neutral-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-neutral-500 mt-4 leading-relaxed max-w-sm">
                    These are typical ranges. Complete the calculator to get a personalised breakdown for your specific project — sent to your email and WhatsApp.
                  </p>
                </div>

                <div className="flex flex-col items-start md:items-end gap-4 md:min-w-[240px]">
                  <div className="md:text-right">
                    <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider mb-1">Typical cost range</p>
                    <p className="text-xl md:text-2xl font-semibold text-neutral-900">{selectedType.costRange}</p>
                  </div>
                  <Link
                    href={`/calculate?type=${selectedType.type}`}
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#ED1A3B] hover:bg-[#c71432] rounded-full transition-colors duration-200 shadow-[0_2px_8px_-2px_rgba(237,26,59,0.4)]"
                  >
                    Get Your Personalised Report
                    <ArrowRight className="w-4 h-4" strokeWidth={2} />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
