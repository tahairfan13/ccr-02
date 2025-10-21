"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Mail, Phone, Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { fbPixelEvent } from "@/lib/fbPixel";
import clarityEvent from "@/lib/msClarity";

export default function ThankYouPage() {
  const router = useRouter();

  useEffect(() => {
    // Track successful conversion on thank you page with Facebook Pixel
    fbPixelEvent.custom('ThankYouPageView', {
      content_name: 'Thank You Page',
    });

    // Track thank you page view with Microsoft Clarity
    clarityEvent.pageView('Thank You');
    clarityEvent.setTag('conversion', 'completed');
    clarityEvent.upgrade('successful_submission');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-2xl"
      >
        <Card className="p-8 md:p-12 text-center shadow-xl border-2 border-gray-100">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className="mb-6"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 mx-auto bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-12 h-12 md:w-14 md:h-14 text-white" strokeWidth={2.5} />
            </div>
          </motion.div>

          {/* Main Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Thank You! 🎉
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Your project estimate has been submitted successfully
            </p>
          </motion.div>

          {/* What Happens Next Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              What happens next?
            </h2>
            <div className="space-y-4 text-left">

              <div className="flex gap-4 items-start p-4 bg-purple-50 rounded-lg border border-purple-100">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Check Your Whatsapp
                  </h3>
                  <p className="text-sm text-gray-600">
                    You'll also receive a confirmation message on your verified phone number.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    We'll Contact You Soon
                  </h3>
                  <p className="text-sm text-gray-600">
                    Our sales team will reach out within 24 hours to discuss your project requirements and answer any questions.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            <p className="text-sm text-gray-600">
              Have questions in the meantime?{" "}
              <a
                href="mailto:hello@tecaudex.com"
                className="text-[#ed1a3b] hover:text-[#d11632] font-semibold underline"
              >
                Contact us at hello@tecaudex.com
              </a>
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Button
              onClick={() => router.push("/")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#ed1a3b] hover:bg-[#d11632] text-white font-semibold rounded-lg shadow-md transition-all"
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={2} />
              Back to Home
            </Button>
          </motion.div>
        </Card>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-center text-sm text-gray-500 mt-6"
        >
          Your privacy is important to us. We'll never share your information with third parties.
        </motion.p>
      </motion.div>
    </div>
  );
}
