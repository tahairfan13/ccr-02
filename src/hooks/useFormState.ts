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
    phone: "",
    emailVerified: false,
    phoneVerified: false,
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
    phone: string
  ) => {
    setFormData((prev) => ({ ...prev, name, email, phone }));
  };

  const updateVerificationStatus = (
    field: "emailVerified" | "phoneVerified",
    value: boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
    nextStep,
    prevStep,
    goToStep,
  };
}
