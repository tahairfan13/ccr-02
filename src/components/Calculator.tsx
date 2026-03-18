"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import ProgressIndicator from "@/components/ProgressIndicator";
import Step1ApplicationType from "@/components/steps/Step1ApplicationType";
import Step2ProjectScale from "@/components/steps/Step2ProjectScale";
import Step3Description from "@/components/steps/Step3Description";
import Step4Features from "@/components/steps/Step4Features";
import Step5Contact from "@/components/steps/Step5Contact";
import { Button } from "@/components/ui/button";
import { useFormState } from "@/hooks/useFormState";
import { useTrackingParams, getTrafficSourceLabel } from "@/hooks/useTrackingParams";
import { useTrafficSource, getSourcebusterData, getStoredGclid } from "@/hooks/useTrafficSource";
import { ArrowRight, ArrowLeft, Send, Loader2 } from "lucide-react";
import { fbPixelEvent } from "@/lib/fbPixel";
import clarityEvent from "@/lib/msClarity";
import { sendGoogleChatNotification } from "@/lib/googleChatWebhook";

export default function Calculator() {
  return (
    <Suspense fallback={<CalculatorLoading />}>
      <CalculatorContent />
    </Suspense>
  );
}

function CalculatorLoading() {
  return (
    <div className="flex items-center justify-center py-32">
      <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
    </div>
  );
}

function CalculatorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
  // Primary tracking: server-side middleware cookies (Safari ITP resilient)
  const trackingParams = useTrackingParams();
  // Legacy tracking: sourcebuster (fallback for Clarity tagging)
  const trafficSource = useTrafficSource();

  const [isGeneratingFeatures, setIsGeneratingFeatures] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initEstimateSent = useRef(false);
  const trafficSourceTagged = useRef(false);
  const typePreFilled = useRef(false);

  // Pre-fill application type from URL params (e.g. /calculate?type=mobile)
  useEffect(() => {
    if (typePreFilled.current) return;
    const typeParam = searchParams.get("type");
    if (typeParam && ["ai", "blockchain", "mobile", "web"].includes(typeParam)) {
      typePreFilled.current = true;
      updateApplicationTypes([typeParam as "ai" | "blockchain" | "mobile" | "web"]);
    }
  }, [searchParams]);

  // Tag Clarity sessions with traffic source info
  useEffect(() => {
    if (trafficSourceTagged.current) return;
    // Prefer middleware cookies, fall back to sourcebuster
    const source = getTrafficSourceLabel(trackingParams) || trafficSource.source;
    if (source === "Direct" && trafficSource.source === "Direct") {
      trafficSourceTagged.current = true;
      clarityEvent.setTag('traffic_source', 'Direct');
      return;
    }
    trafficSourceTagged.current = true;
    clarityEvent.setTag('traffic_source', source);
    const utmSource = trackingParams.utm_source || trafficSource.utmSource;
    const utmMedium = trackingParams.utm_medium || trafficSource.utmMedium;
    const utmCampaign = trackingParams.utm_campaign || trafficSource.utmCampaign;
    if (utmSource) clarityEvent.setTag('utm_source', utmSource);
    if (utmMedium) clarityEvent.setTag('utm_medium', utmMedium);
    if (utmCampaign) clarityEvent.setTag('utm_campaign', utmCampaign);
    if (trackingParams.gclid || trafficSource.gclid) clarityEvent.setTag('has_gclid', 'true');
    if (trackingParams.fbclid || trafficSource.fbclid) clarityEvent.setTag('has_fbclid', 'true');
    if (trackingParams.msclkid) clarityEvent.setTag('has_msclkid', 'true');
  }, [trackingParams, trafficSource]);

  /**
   * Build the full tracking payload for submission.
   * Priority: middleware cookies (_txa_*) > sourcebuster > stored gclid
   */
  const getTrackingPayload = () => {
    const persistedGclid = trackingParams.gclid || trafficSource.gclid || getStoredGclid();
    const source = getTrafficSourceLabel(trackingParams) !== "Direct"
      ? getTrafficSourceLabel(trackingParams)
      : trafficSource.source;

    return {
      source: persistedGclid && source === "Direct" ? "google_ads" : source,
      gclid: persistedGclid || "",
      gbraid: trackingParams.gbraid || "",
      wbraid: trackingParams.wbraid || "",
      fbclid: trackingParams.fbclid || trafficSource.fbclid || "",
      msclkid: trackingParams.msclkid || "",
      utm_source: trackingParams.utm_source || trafficSource.utmSource || "",
      utm_medium: trackingParams.utm_medium || trafficSource.utmMedium || "",
      utm_campaign: trackingParams.utm_campaign || trafficSource.utmCampaign || "",
      utm_term: trackingParams.utm_term || trafficSource.utmTerm || "",
      utm_content: trackingParams.utm_content || trafficSource.utmContent || "",
      landing_page: trackingParams.landing_page || trafficSource.landingPage || "",
      referrer: trackingParams.referrer || trafficSource.referrer || "",
    };
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
        return formData.features.some((f) => f.selected);
      case 5:
        return (
          formData.name.trim().length > 0 &&
          formData.emailVerified &&
          formData.phoneVerified
        );
      default:
        return false;
    }
  };

  const handleNext = async () => {
    const stepName = getStepName(currentStep);

    fbPixelEvent.custom('StepCompleted', {
      step_number: currentStep,
      step_name: stepName,
    });

    clarityEvent.stepCompleted(currentStep, stepName);

    if (currentStep === 1 && formData.applicationTypes.length > 0) {
      clarityEvent.setTag('app_types', formData.applicationTypes.join(', '));
    } else if (currentStep === 2 && formData.projectScale) {
      clarityEvent.setTag('project_scale', formData.projectScale);
    } else if (currentStep === 3) {
      const wordCount = formData.description.trim().split(/\s+/).filter(Boolean).length;
      clarityEvent.setTag('description_words', wordCount);
    } else if (currentStep === 4) {
      const selectedCount = formData.features.filter(f => f.selected).length;
      clarityEvent.setTag('features_selected_at_step', selectedCount);
    }

    if (currentStep === 3 && (formData.features.length === 0 || formData.description !== formData.lastGeneratedDescription)) {
      await generateFeatures();
    }
    nextStep();
  };

  const getStepName = (step: number) => {
    switch (step) {
      case 1: return 'Application Type';
      case 2: return 'Project Scale';
      case 3: return 'Description';
      case 4: return 'Feature Selection';
      case 5: return 'Contact Info';
      default: return 'Unknown';
    }
  };

  const generateFeatures = async () => {
    setIsGeneratingFeatures(true);

    try {
      const response = await fetch("/api/generate-features", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      updateFeatures(data.features, formData.description);
    } catch (error) {
      console.error("Error generating features:", error);
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

    // Tag Clarity with contact info
    clarityEvent.setTag("user_country", formData.country);
    clarityEvent.setTag("user_name", formData.name);
    clarityEvent.identify(formData.email);

    const tracking = getTrackingPayload();

    try {
      const selectedFeatures = formData.features.filter((f) => f.selected);
      const totalHours = selectedFeatures.reduce((sum, f) => sum + f.hours, 0);

      const payload = {
        applicationTypes: formData.applicationTypes,
        projectScale: formData.projectScale,
        description: formData.description,
        features: selectedFeatures,
        totalHours,
        estimatedCost: totalHours * 22,
        hourlyRate: 22,
        contact: {
          name: formData.name,
          email: formData.email,
          country: formData.country,
          phone_number: `${formData.countryCode} ${formData.phone}`,
        },
        traffic_source: tracking.source,
        gclid: tracking.gclid,
        gbraid: tracking.gbraid,
        wbraid: tracking.wbraid,
        fbclid: tracking.fbclid,
        msclkid: tracking.msclkid,
        utm_source: tracking.utm_source,
        utm_medium: tracking.utm_medium,
        utm_campaign: tracking.utm_campaign,
        utm_term: tracking.utm_term,
        utm_content: tracking.utm_content,
        landing_page: tracking.landing_page,
        referrer: tracking.referrer,
        trafficSource: tracking,
      };

      console.log("📤 Submitting with tracking:", tracking);

      const response = await fetch("https://crm.tecaudex.com/api/v1/submit_estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const result = await response.json();
      console.log("Submission successful:", result);

      fbPixelEvent.lead({
        content_name: 'Cost Calculator Form',
        value: totalHours * 22,
        currency: 'GBP',
      });

      clarityEvent.formSubmitted({
        applicationTypes: formData.applicationTypes.join(', '),
        projectScale: formData.projectScale,
        totalHours,
        estimatedCost: totalHours * 22,
        featuresCount: selectedFeatures.length,
      });

      clarityEvent.setTag('total_hours', totalHours);
      clarityEvent.setTag('estimated_cost', totalHours * 22);
      clarityEvent.setTag('features_selected', selectedFeatures.length);

      const minCost = totalHours * 0.8 * 22;
      const maxCost = totalHours * 1.3 * 22;
      const exactCost = totalHours * 22;

      await sendGoogleChatNotification({
        name: formData.name,
        email: formData.email,
        country: formData.country,
        phone: formData.phone,
        countryCode: formData.countryCode,
        applicationType: formData.applicationTypes,
        projectScale: formData.projectScale,
        description: formData.description,
        totalHours,
        estimatedCost: { min: minCost, max: maxCost },
        exactCost,
        isComplete: true,
        trafficSource: tracking,
      });

      toast.success("Estimate Submitted Successfully!", {
        description: "Redirecting to confirmation page...",
        duration: 2000,
      });

      try {
        sessionStorage.setItem("estimatedCost", String(totalHours * 22));
      } catch {}

      setTimeout(() => {
        router.push("/thank-you");
      }, 1500);
    } catch (error: any) {
      console.error("Error submitting form:", error);
      clarityEvent.error('form_submission_error', error.message || 'Unknown error');

      toast.error("Submission Failed", {
        description: error.message || "We couldn't submit your request. Please try again or contact us at hello@tecaudex.com",
        duration: 5000,
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <ProgressIndicator currentStep={currentStep} />

      <div className="flex-1 overflow-y-auto md:overflow-visible pb-20 md:pb-0 md:mt-8 md:mb-12 relative"
           style={{
             WebkitOverflowScrolling: 'touch',
             scrollbarWidth: 'none',
             msOverflowStyle: 'none',
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
            <Step4Features
              features={formData.features}
              onToggleFeature={toggleFeature}
              isLoading={isGeneratingFeatures}
            />
          )}

          {currentStep === 5 && (
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
        </motion.div>
      </div>

      {/* Navigation — fixed bottom on mobile */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed md:static bottom-0 left-0 right-0 md:w-auto z-50"
      >
        <div className="max-w-4xl mx-auto px-5 flex items-center justify-between gap-3 py-4 md:py-0 md:mb-10 bg-white/90 md:bg-transparent backdrop-blur-[22px] md:backdrop-blur-none"
             style={{
               paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
             }}>
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1 || isGeneratingFeatures || isSubmitting}
            className="flex items-center gap-1.5 px-4 py-2.5 md:px-5 md:py-2.5 text-sm font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-all rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
            <span className="hidden sm:inline">Back</span>
          </Button>

          {currentStep < 5 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed() || isGeneratingFeatures}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 md:px-8 md:py-3 text-sm md:text-base font-semibold bg-neutral-900 hover:bg-neutral-800 text-white transition-all duration-200 rounded-full min-w-[140px] disabled:opacity-40 disabled:cursor-not-allowed"
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
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 md:px-8 md:py-3 text-sm md:text-base font-semibold bg-[#ED1A3B] hover:bg-[#c71432] text-white transition-all duration-200 rounded-full min-w-[140px] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 md:w-5 md:h-5 animate-spin" strokeWidth={2} />
                  <span className="hidden sm:inline">Submitting...</span>
                  <span className="sm:hidden">Sending...</span>
                </>
              ) : (
                <>
                  <span className="font-bold">Get My Report</span>
                  <Send className="w-5 h-5 md:w-5 md:h-5" strokeWidth={2.5} />
                </>
              )}
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
