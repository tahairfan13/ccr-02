"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProgressIndicator from "@/components/ProgressIndicator";
import Step1ApplicationType from "@/components/steps/Step1ApplicationType";
import Step2ProjectScale from "@/components/steps/Step2ProjectScale";
import Step3Description from "@/components/steps/Step3Description";
import Step4Features from "@/components/steps/Step4Features";
import Step5Contact from "@/components/steps/Step5Contact";
import { Button } from "@/components/ui/button";
import { useFormState } from "@/hooks/useFormState";
import { ArrowRight, ArrowLeft, Send, Loader2 } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const {
    currentStep,
    formData,
    updateApplicationTypes,
    updateProjectScale,
    updateDescription,
    updateFeatures,
    toggleFeature,
    updateContactInfo,
    updateVerificationStatus,
    nextStep,
    prevStep,
  } = useFormState();

  const [isGeneratingFeatures, setIsGeneratingFeatures] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initEstimateSent = useRef(false);

  // Send init_estimates when Step 5 is rendered (after Step 4 completion)
  useEffect(() => {
    if (currentStep === 5 && !initEstimateSent.current) {
      // Mark as sent to prevent duplicate calls
      initEstimateSent.current = true;

      // Use setTimeout to ensure Step 5 renders first
      setTimeout(() => {
        sendInitEstimate();
      }, 100);
    }
  }, [currentStep]);

  const sendInitEstimate = async () => {
    try {
      const selectedFeatures = formData.features.filter((f) => f.selected);
      const totalHours = selectedFeatures.reduce((sum, f) => sum + f.hours, 0);

      const payload = {
        applicationTypes: formData.applicationTypes,
        projectScale: formData.projectScale,
        description: formData.description,
        features: selectedFeatures,
        totalHours,
        estimatedCost: totalHours * 30,
        hourlyRate: 30,
        contact: {
          name: formData.name,
          email: formData.email,
          country: formData.country,
          phone_number: `${formData.countryCode} ${formData.phone}`,
        },
      };

      console.log("Sending init estimate:", payload);

      const response = await fetch("https://crm.tecaudex.com/api/v1/init_estimates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        console.error("Failed to send init estimate:", response.status);
      } else {
        console.log("Init estimate sent successfully");
      }
    } catch (error) {
      console.error("Error sending init estimate:", error);
      // Silently fail - don't show error to user
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.applicationTypes.length > 0;
      case 2:
        return formData.projectScale !== null;
      case 3:
        const wordCount = formData.description.trim().split(/\s+/).filter(Boolean).length;
        return wordCount >= 10;
      case 4:
        return (
          formData.name.trim().length > 0 &&
          formData.emailVerified &&
          formData.phoneVerified
        );
      case 5:
        return formData.features.some((f) => f.selected);
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (currentStep === 4 && formData.features.length === 0) {
      // Generate features after step 4 (contact info)
      await generateFeatures();
    }
    nextStep();
  };

  const generateFeatures = async () => {
    setIsGeneratingFeatures(true);

    try {
      const response = await fetch("/api/generate-features", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          applicationTypes: formData.applicationTypes,
          projectScale: formData.projectScale,
          description: formData.description,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate features");
      }

      const data = await response.json();
      updateFeatures(data.features);
    } catch (error) {
      console.error("Error generating features:", error);
      // Fallback to example features on error
      updateFeatures([
        {
          id: "1",
          name: "User Authentication",
          description: "Secure login and registration system with email verification",
          hours: 40,
          category: "Authentication",
          selected: true,
        },
        {
          id: "2",
          name: "Dashboard",
          description: "Main user dashboard with analytics and key metrics",
          hours: 60,
          category: "Core Features",
          selected: true,
        },
      ]);
    } finally {
      setIsGeneratingFeatures(false);
    }
  };

  const handleSubmit = async () => {
    if (!canProceed()) return;

    setIsSubmitting(true);

    try {
      const selectedFeatures = formData.features.filter((f) => f.selected);
      const totalHours = selectedFeatures.reduce((sum, f) => sum + f.hours, 0);

      const payload = {
        applicationTypes: formData.applicationTypes,
        projectScale: formData.projectScale,
        description: formData.description,
        features: selectedFeatures,
        totalHours,
        estimatedCost: totalHours * 30,
        hourlyRate: 30,
        contact: {
          name: formData.name,
          email: formData.email,
          country: formData.country,
          phone_number: `${formData.countryCode} ${formData.phone}`,
        },
      };

      console.log("Submitting data:", payload);

      // Submit to actual API endpoint
      const response = await fetch("https://crm.tecaudex.com/api/v1/submit_estimate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const result = await response.json();
      console.log("Submission successful:", result);

      toast.success("🎉 Estimate Submitted Successfully!", {
        description: "Redirecting to confirmation page...",
        duration: 2000,
      });

      // Redirect to thank you page after a brief delay
      setTimeout(() => {
        router.push("/thank-you");
      }, 1500);
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error("❌ Submission Failed", {
        description: error.message || "We couldn't submit your request. Please try again or contact us at hello@tecaudex.com",
        duration: 5000,
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen md:min-h-screen bg-background flex flex-col md:block">
      <Header />

      <main className="flex-1 flex flex-col min-h-0 md:block md:pb-20 relative">
        <ProgressIndicator currentStep={currentStep} />

        <div className="flex-1 overflow-y-auto md:overflow-visible pb-20 md:pb-0 md:mt-8 md:mb-12 relative"
             style={{
               WebkitOverflowScrolling: 'touch',
               scrollbarWidth: 'none',
               msOverflowStyle: 'none'
             }}>
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="md:animate-none"
          >
            {currentStep === 1 && (
              <Step1ApplicationType
                selectedTypes={formData.applicationTypes}
                onSelectType={updateApplicationTypes}
              />
            )}

            {currentStep === 2 && (
              <Step2ProjectScale
                selectedScale={formData.projectScale}
                onSelectScale={updateProjectScale}
              />
            )}

            {currentStep === 3 && (
              <Step3Description
                description={formData.description}
                onDescriptionChange={updateDescription}
              />
            )}

            {currentStep === 4 && (
              <Step5Contact
                name={formData.name}
                email={formData.email}
                country={formData.country}
                countryCode={formData.countryCode}
                phone={formData.phone}
                emailVerified={formData.emailVerified}
                phoneVerified={formData.phoneVerified}
                onContactChange={updateContactInfo}
                onVerificationChange={updateVerificationStatus}
              />
            )}

            {currentStep === 5 && (
              <Step4Features
                features={formData.features}
                onToggleFeature={toggleFeature}
                isLoading={isGeneratingFeatures}
              />
            )}
          </motion.div>
        </div>

        {/* Navigation Buttons - Fixed at bottom on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed md:static bottom-0 left-0 right-0 md:w-auto z-50"
        >
          <div className="max-w-4xl mx-auto px-4 flex items-center justify-between gap-3 md:gap-4 py-4 md:py-0 md:mb-8 bg-white md:bg-transparent border-t md:border-t-0 border-gray-200 md:border-0 shadow-[0_-4px_12px_-2px_rgba(0,0,0,0.08)] md:shadow-none backdrop-blur-sm md:backdrop-blur-none"
               style={{
                 paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
                 paddingTop: 'max(1rem, env(safe-area-inset-top))'
               }}>
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1 || isGeneratingFeatures || isSubmitting}
            className="flex items-center gap-1.5 md:gap-2 px-4 py-3 md:px-6 md:py-3 text-sm md:text-base font-semibold border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all rounded-xl md:rounded-lg disabled:opacity-40 disabled:cursor-not-allowed shadow-sm active:scale-95 md:active:scale-100"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
            <span className="hidden sm:inline">Back</span>
          </Button>

          {currentStep < 5 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed() || isGeneratingFeatures}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-3 text-sm md:text-base font-bold bg-gradient-to-r from-[#ed1a3b] to-[#d11632] md:bg-[#ed1a3b] hover:from-[#d11632] hover:to-[#b01228] md:hover:bg-[#d11632] text-white transition-all rounded-xl md:rounded-lg shadow-lg md:shadow-sm hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-[#ed1a3b] disabled:hover:to-[#d11632] disabled:hover:bg-[#ed1a3b] active:scale-95 md:active:scale-100"
            >
              {isGeneratingFeatures ? (
                <>
                  <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" strokeWidth={2} />
                  <span className="hidden sm:inline">AI Analyzing...</span>
                  <span className="sm:hidden">Loading...</span>
                </>
              ) : (
                <>
                  <span className="font-bold">Continue</span>
                  <ArrowRight className="w-5 h-5 md:w-5 md:h-5" strokeWidth={2.5} />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 md:px-8 md:py-3 text-sm md:text-base font-bold bg-gradient-to-r from-green-600 to-green-700 md:bg-[#ed1a3b] hover:from-green-700 hover:to-green-800 md:hover:bg-[#d11632] text-white transition-all rounded-xl md:rounded-lg shadow-lg md:shadow-sm hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:from-green-600 disabled:hover:to-green-700 disabled:hover:bg-[#ed1a3b] active:scale-95 md:active:scale-100"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 md:w-5 md:h-5 animate-spin" strokeWidth={2} />
                  <span className="hidden sm:inline">Submitting...</span>
                  <span className="sm:hidden">Sending...</span>
                </>
              ) : (
                <>
                  <span className="font-bold">Get Estimate</span>
                  <Send className="w-5 h-5 md:w-5 md:h-5" strokeWidth={2.5} />
                </>
              )}
            </Button>
          )}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
