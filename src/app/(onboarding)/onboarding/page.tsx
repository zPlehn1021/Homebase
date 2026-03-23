"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { StepIndicator } from "@/components/onboarding/step-indicator";
import { StepWelcome } from "@/components/onboarding/step-welcome";
import { StepHomeProfile } from "@/components/onboarding/step-home-profile";
import { StepHomeSystems } from "@/components/onboarding/step-home-systems";
import { StepTaskReview } from "@/components/onboarding/step-task-review";
import { StepConfirmation } from "@/components/onboarding/step-confirmation";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Profile state
  const [propertyType, setPropertyType] = useState<string | null>(null);
  const [homeAge, setHomeAge] = useState<number | null>(null);
  const [squareFootage, setSquareFootage] = useState<number | null>(null);
  const [homeFeatures, setHomeFeatures] = useState<string[]>([]);
  const [excludedTitles, setExcludedTitles] = useState<string[]>([]);

  const toggleFeature = useCallback((feature: string) => {
    setHomeFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  }, []);

  const handleSkip = useCallback(async () => {
    try {
      // Save defaults
      await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyType: "house",
          homeAgeYears: 10,
          squareFootage: 2000,
          homeFeatures: [],
          onboardingCompleted: true,
        }),
      });

      // Generate tasks with defaults
      await fetch("/api/tasks/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ homeFeatures: [] }),
      });

      window.location.href = "/dashboard";
    } catch {
      // If API fails, still navigate — mock mode will handle it
      window.location.href = "/dashboard";
    }
  }, []);

  return (
    <div className="py-8">
      <StepIndicator currentStep={step} />

      {step === 1 && (
        <StepWelcome onNext={() => setStep(2)} onSkip={handleSkip} />
      )}

      {step === 2 && (
        <StepHomeProfile
          propertyType={propertyType}
          homeAge={homeAge}
          squareFootage={squareFootage}
          onPropertyType={setPropertyType}
          onHomeAge={setHomeAge}
          onSquareFootage={setSquareFootage}
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <StepHomeSystems
          selectedFeatures={homeFeatures}
          onToggle={toggleFeature}
          onNext={() => setStep(4)}
          onBack={() => setStep(2)}
        />
      )}

      {step === 4 && (
        <StepTaskReview
          propertyType={propertyType || "house"}
          homeFeatures={homeFeatures}
          excludedTitles={excludedTitles}
          onExcludedChange={setExcludedTitles}
          onNext={() => setStep(5)}
          onBack={() => setStep(3)}
        />
      )}

      {step === 5 && (
        <StepConfirmation
          propertyType={propertyType || "house"}
          homeAge={homeAge || 10}
          squareFootage={squareFootage || 2000}
          homeFeatures={homeFeatures}
          excludedTitles={excludedTitles}
        />
      )}
    </div>
  );
}
