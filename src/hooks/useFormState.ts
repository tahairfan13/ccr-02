"use client";

import { useState } from "react";
import { ApplicationType, ProjectScale, FormData, Feature } from "@/types";

export function useFormState() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    applicationTypes: [],
    projectScale: null,
    description: "",
    features: [],
    name: "",
    email: "",
    country: "United States",
    countryCode: "+1",
    phone: "",
    emailVerified: false,
    phoneVerified: false,
    trafficSource: "Direct",
  });

  const updateApplicationTypes = (types: ApplicationType[]) => {
    setFormData((prev) => ({ ...prev, applicationTypes: types }));
  };

  const updateProjectScale = (scale: ProjectScale) => {
    setFormData((prev) => ({ ...prev, projectScale: scale }));
  };

  const updateDescription = (description: string) => {
    setFormData((prev) => ({ ...prev, description }));
  };

  const updateFeatures = (features: Feature[]) => {
    setFormData((prev) => ({ ...prev, features }));
  };

  const toggleFeature = (featureId: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((f) =>
        f.id === featureId ? { ...f, selected: !f.selected } : f
      ),
    }));
  };

  const updateContactInfo = (
    name: string,
    email: string,
    country: string,
    countryCode: string,
    phone: string
  ) => {
    setFormData((prev) => ({ ...prev, name, email, country, countryCode, phone }));
  };

  const updateVerificationStatus = (
    field: "emailVerified" | "phoneVerified",
    value: boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateTrafficSource = (
    trafficSource: string,
    utmSource?: string,
    utmMedium?: string,
    utmCampaign?: string,
    referrer?: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      trafficSource,
      utmSource,
      utmMedium,
      utmCampaign,
      referrer,
    }));
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  const goToStep = (step: number) => setCurrentStep(step);

  return {
    currentStep,
    formData,
    updateApplicationTypes,
    updateProjectScale,
    updateDescription,
    updateFeatures,
    toggleFeature,
    updateContactInfo,
    updateVerificationStatus,
    updateTrafficSource,
    nextStep,
    prevStep,
    goToStep,
  };
}
