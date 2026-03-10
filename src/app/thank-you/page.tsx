"use client";

import { motion } from "framer-motion";
import { Check, Phone, Calendar, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { fbPixelEvent } from "@/lib/fbPixel";
import clarityEvent from "@/lib/msClarity";
import { getTrackingParams, getTrafficSourceLabel } from "@/hooks/useTrackingParams";
import TopGlow from "@/components/TopGlow";

const emptySubscribe = () => () => {};
function getCostSnapshot(): string | null {
  try { return sessionStorage.getItem("estimatedCost"); } catch { return null; }
}
function getServerSnapshot(): string | null { return null; }

export default function ThankYouPage() {
  const router = useRouter();
  const estimatedCost = useSyncExternalStore(emptySubscribe, getCostSnapshot, getServerSnapshot);

  useEffect(() => {
    fbPixelEvent.custom('ThankYouPageView', { content_name: 'Thank You Page' });
    clarityEvent.pageView('Thank You');
    clarityEvent.setTag('conversion', 'completed');
    clarityEvent.upgrade('successful_submission');

    // Push conversion event to dataLayer for GTM/Google Ads
    if (typeof window !== "undefined") {
      const w = window as unknown as { dataLayer: Record<string, unknown>[] };
      w.dataLayer = w.dataLayer || [];

      const tracking = getTrackingParams();
      w.dataLayer.push({
        event: "conversion",
        conversion_type: "calculator_submission_complete",
        traffic_source: getTrafficSourceLabel(tracking),
        gclid: tracking.gclid || undefined,
        gbraid: tracking.gbraid || undefined,
        wbraid: tracking.wbraid || undefined,
        fbclid: tracking.fbclid || undefined,
        msclkid: tracking.msclkid || undefined,
        utm_source: tracking.utm_source || undefined,
        utm_medium: tracking.utm_medium || undefined,
        utm_campaign: tracking.utm_campaign || undefined,
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex items-center justify-center px-5 py-12">
      <TopGlow />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-xl relative"
      >
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
          className="flex justify-center mb-8"
        >
          <div className="w-16 h-16 rounded-full bg-neutral-900 flex items-center justify-center">
            <Check className="w-8 h-8 text-white" strokeWidth={3} />
          </div>
        </motion.div>

        {/* Text */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-semibold text-neutral-900 mb-2">Thank you</h1>
          {estimatedCost && (
            <p className="text-lg font-semibold text-[#ED1A3B] mb-1">
              Estimated cost: £{Number(estimatedCost).toLocaleString()}
            </p>
          )}
          <p className="text-base text-neutral-600">Your detailed cost breakdown and roadmap are on the way to your email and WhatsApp.</p>
        </motion.div>

        {/* Next steps */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="space-y-3 mb-10">
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#f7f7f6]">
            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
              <Phone className="w-4 h-4 text-neutral-500" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 text-sm mb-0.5">Check your WhatsApp</h3>
              <p className="text-xs text-neutral-600">Your report will be sent to your verified WhatsApp number.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#f7f7f6]">
            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-4 h-4 text-neutral-500" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 text-sm mb-0.5">We'll contact you within 24 hours</h3>
              <p className="text-xs text-neutral-600">Our team will discuss your requirements and answer questions.</p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="https://cal.com/tecaudex/discovery-call?duration=30"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#ED1A3B] hover:bg-[#c71432] text-white text-sm font-semibold rounded-full transition-colors duration-200"
          >
            <Calendar className="w-4 h-4" strokeWidth={1.5} />
            Book a Discovery Call
          </a>
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-sm font-semibold rounded-full transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
            Back to Home
          </button>
        </motion.div>

        {/* Footer note */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-10 text-center">
          <p className="text-xs text-neutral-500">
            Questions? <a href="mailto:sales@tecaudex.com" className="text-neutral-600 hover:text-[#ED1A3B] transition-colors">sales@tecaudex.com</a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
