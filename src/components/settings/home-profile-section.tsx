"use client";

import { useState } from "react";
import type { User } from "@/lib/hooks/use-user";
import {
  propertyTypes,
  homeAgeOptions,
  sqftOptions,
  systems,
} from "@/lib/constants/home-profile";

export function HomeProfileSection({
  user,
  onSave,
  saving,
}: {
  user: User;
  onSave: (updates: Record<string, unknown>) => Promise<void>;
  saving: boolean;
}) {
  const [propertyType, setPropertyType] = useState(user.propertyType);
  const [homeAge, setHomeAge] = useState(user.homeAgeYears);
  const [sqft, setSqft] = useState(user.squareFootage);
  const [features, setFeatures] = useState<string[]>(
    user.homeFeatures || []
  );
  const [showRegenPrompt, setShowRegenPrompt] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  const isDirty =
    propertyType !== user.propertyType ||
    homeAge !== user.homeAgeYears ||
    sqft !== user.squareFootage ||
    JSON.stringify(features) !== JSON.stringify(user.homeFeatures || []);

  const profileChanged =
    propertyType !== user.propertyType ||
    JSON.stringify(features) !== JSON.stringify(user.homeFeatures || []);

  const toggleFeature = (key: string) => {
    setFeatures((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );
  };

  const handleSave = async () => {
    await onSave({
      propertyType,
      homeAgeYears: homeAge,
      squareFootage: sqft,
      homeFeatures: features,
    });
    if (profileChanged) {
      setShowRegenPrompt(true);
    }
  };

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      await fetch("/api/tasks/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ homeFeatures: features }),
      });
    } finally {
      setRegenerating(false);
      setShowRegenPrompt(false);
    }
  };

  const handleReset = async () => {
    setPropertyType(null);
    setHomeAge(null);
    setSqft(null);
    setFeatures([]);
    await onSave({
      propertyType: null,
      homeAgeYears: null,
      squareFootage: null,
      homeFeatures: [],
    });
    setShowResetConfirm(false);
  };

  return (
    <div className="bg-cream rounded-2xl border border-stone-200 p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-stone-900">Home Profile</h2>
        <p className="text-sm text-stone-500 mt-0.5">
          Update your home details to get better task recommendations.
        </p>
      </div>

      {/* Regeneration Prompt */}
      {showRegenPrompt && (
        <div className="bg-sage-50 border border-sage-200 rounded-xl p-4 space-y-3">
          <p className="text-sm text-sage-800">
            Your home profile has changed. Would you like to regenerate your
            maintenance tasks? Custom tasks will be kept.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleRegenerate}
              disabled={regenerating}
              className="px-4 py-2 rounded-xl bg-sage-600 text-white text-sm font-medium hover:bg-sage-700 disabled:opacity-50 transition-colors"
            >
              {regenerating ? "Regenerating..." : "Regenerate Tasks"}
            </button>
            <button
              onClick={() => setShowRegenPrompt(false)}
              className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 text-sm font-medium hover:bg-stone-50 transition-colors"
            >
              Skip
            </button>
          </div>
        </div>
      )}

      {/* Property Type */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-stone-700">
          Property type
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {propertyTypes.map((pt) => (
            <button
              key={pt.key}
              onClick={() => setPropertyType(pt.key)}
              className={`
                flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all
                ${
                  propertyType === pt.key
                    ? "border-sage-600 bg-sage-50 shadow-sm"
                    : "border-stone-200 bg-white hover:border-sage-300"
                }
              `}
            >
              <span className="text-2xl">{pt.icon}</span>
              <span
                className={`text-xs font-medium ${
                  propertyType === pt.key ? "text-sage-800" : "text-stone-600"
                }`}
              >
                {pt.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Home Age */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-stone-700">
          Home age
        </label>
        <div className="flex flex-wrap gap-2">
          {homeAgeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setHomeAge(opt.value)}
              className={`
                px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${
                  homeAge === opt.value
                    ? "bg-sage-600 text-white shadow-sm"
                    : "bg-white border border-stone-200 text-stone-600 hover:border-sage-300"
                }
              `}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Square Footage */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-stone-700">
          Square footage
        </label>
        <div className="flex flex-wrap gap-2">
          {sqftOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSqft(opt.value)}
              className={`
                px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${
                  sqft === opt.value
                    ? "bg-sage-600 text-white shadow-sm"
                    : "bg-white border border-stone-200 text-stone-600 hover:border-sage-300"
                }
              `}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Home Systems */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-stone-700">
          Home systems
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {systems.map((sys) => {
            const isSelected = features.includes(sys.key);
            return (
              <button
                key={sys.key}
                onClick={() => toggleFeature(sys.key)}
                className={`
                  flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-left
                  ${
                    isSelected
                      ? "border-sage-600 bg-sage-50"
                      : "border-stone-200 bg-white hover:border-sage-300"
                  }
                `}
              >
                <span className="text-lg shrink-0">{sys.icon}</span>
                <span
                  className={`text-xs font-medium leading-tight ${
                    isSelected ? "text-sage-800" : "text-stone-600"
                  }`}
                >
                  {sys.label}
                </span>
                {isSelected && (
                  <span className="ml-auto text-sage-600 shrink-0 text-sm">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <div>
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="text-sm text-stone-400 underline hover:text-stone-600 transition-colors"
            >
              Reset to defaults
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500">Reset all fields?</span>
              <button
                onClick={handleReset}
                className="text-xs font-medium text-rose-600 hover:text-rose-700"
              >
                Yes, reset
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="text-xs font-medium text-stone-400 hover:text-stone-600"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        {isDirty && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-sage-600 text-white text-sm font-medium hover:bg-sage-700 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        )}
      </div>
    </div>
  );
}
