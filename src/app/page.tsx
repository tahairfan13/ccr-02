"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
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
        estimatedCost: totalHours * 50,
        contact: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
      };

      // TODO: Replace with your actual endpoint
      console.log("Submitting data:", payload);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Estimate submitted successfully!", {
        description: "Your detailed cost estimate has been sent to your email.",
        duration: 5000,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Submission failed", {
        description: "There was an error submitting your request. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="pb-20 flex-grow">
        <ProgressIndicator currentStep={currentStep} />

        <div className="mt-8 mb-12">
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
        </div>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto px-4 flex items-center justify-between gap-3 md:gap-4 mb-8"
        >
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1 || isGeneratingFeatures || isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-base font-semibold border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2} />
            <span className="hidden sm:inline">Back</span>
          </Button>

          {currentStep < 5 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed() || isGeneratingFeatures}
              className="flex items-center gap-2 px-6 py-2.5 md:px-8 md:py-3 text-sm md:text-base font-semibold bg-[#ed1a3b] hover:bg-[#d11632] text-white transition-all rounded-lg shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#ed1a3b]"
            >
              {isGeneratingFeatures ? (
                <>
                  <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" strokeWidth={2} />
                  <span className="hidden sm:inline">AI Analyzing...</span>
                  <span className="sm:hidden">Loading...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2} />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 md:px-8 md:py-3 text-sm md:text-base font-semibold bg-[#ed1a3b] hover:bg-[#d11632] text-white transition-all rounded-lg shadow-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#ed1a3b]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" strokeWidth={2} />
                  <span className="hidden sm:inline">Submitting...</span>
                  <span className="sm:hidden">Sending...</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">Get Estimate</span>
                  <span className="sm:inline hidden sm:hidden">Submit</span>
                  <Send className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2} />
                </>
              )}
            </Button>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
