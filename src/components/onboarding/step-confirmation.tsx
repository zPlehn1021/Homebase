"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDueLabel } from "@/lib/utils";
import { categoryIcons } from "@/lib/utils";
import type { Task } from "@/lib/types";

interface ConfirmationProps {
  propertyType: string;
  homeAge: number;
  squareFootage: number;
  homeFeatures: string[];
}

const propertyLabels: Record<string, string> = {
  house: "House",
  condo: "Condo",
  townhouse: "Townhouse",
  apartment: "Apartment",
};

function formatSqft(sqft: number): string {
  return sqft.toLocaleString();
}

function formatAge(age: number): string {
  if (age <= 5) return "under 5 years old";
  if (age <= 15) return "6-15 years old";
  if (age <= 30) return "16-30 years old";
  return "30+ years old";
}

export function StepConfirmation({
  propertyType,
  homeAge,
  squareFootage,
  homeFeatures,
}: ConfirmationProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"saving" | "generating" | "done" | "error">("saving");
  const [taskCount, setTaskCount] = useState(0);
  const [previewTasks, setPreviewTasks] = useState<Task[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        // Step 1: Save user profile
        setStatus("saving");
        const userRes = await fetch("/api/user", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            propertyType,
            homeAgeYears: homeAge,
            squareFootage,
            homeFeatures,
            onboardingCompleted: true,
          }),
        });
        if (!userRes.ok) throw new Error("Failed to save profile");

        if (cancelled) return;

        // Step 2: Generate tasks
        setStatus("generating");
        const genRes = await fetch("/api/tasks/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ homeFeatures }),
        });
        if (!genRes.ok) throw new Error("Failed to generate tasks");
        const genData = await genRes.json();

        if (cancelled) return;

        setTaskCount(genData.generated);

        // Step 3: Fetch preview of upcoming tasks
        const tasksRes = await fetch("/api/tasks?status=upcoming");
        if (tasksRes.ok) {
          const tasksData = await tasksRes.json();
          setPreviewTasks(tasksData.slice(0, 5));
        }

        setStatus("done");
      } catch (err) {
        console.error("Onboarding error:", err);
        if (!cancelled) setStatus("error");
      }
    }

    run();
    return () => { cancelled = true; };
  }, [propertyType, homeAge, squareFootage, homeFeatures]);

  if (status === "saving" || status === "generating") {
    return (
      <div className="text-center space-y-6 py-16">
        <div className="flex justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-sage-200 border-t-sage-600" />
        </div>
        <div className="space-y-2">
          <p className="text-lg font-semibold text-stone-800">
            {status === "saving"
              ? "Saving your home profile..."
              : "Creating your maintenance plan..."}
          </p>
          <p className="text-sm text-stone-400">This only takes a moment</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="text-center space-y-6 py-16">
        <span className="text-5xl">⚠️</span>
        <div className="space-y-2">
          <p className="text-lg font-semibold text-stone-800">
            Something went wrong
          </p>
          <p className="text-sm text-stone-500">
            We couldn&apos;t save your profile. You can try again or continue with
            default settings.
          </p>
        </div>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-sage-600 text-white hover:bg-sage-700 transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      <div className="text-center space-y-2">
        <span className="text-5xl">🎉</span>
        <h2 className="text-2xl font-bold text-stone-900 mt-3">
          Your home profile is set up!
        </h2>
        <p className="text-stone-500">
          We created{" "}
          <span className="font-bold text-sage-700">{taskCount} maintenance tasks</span>{" "}
          for your home across all four seasons.
        </p>
      </div>

      {/* Profile Summary */}
      <div className="bg-cream rounded-2xl border border-stone-200 p-5 space-y-3">
        <h3 className="text-sm font-semibold text-stone-600">Your Home</h3>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sage-50 border border-sage-200 rounded-lg text-sm text-sage-800 font-medium">
            🏠 {propertyLabels[propertyType] || propertyType}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-700">
            📐 {formatSqft(squareFootage)} sqft
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-700">
            🗓️ {formatAge(homeAge)}
          </span>
        </div>
        {homeFeatures.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {homeFeatures.map((f) => (
              <span
                key={f}
                className="px-2 py-1 bg-sage-50 text-sage-700 text-xs rounded-md border border-sage-200"
              >
                {f.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Task Preview */}
      {previewTasks.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-stone-600">
            Your first upcoming tasks
          </h3>
          <div className="space-y-2">
            {previewTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-cream border border-stone-200"
              >
                <span className="text-lg shrink-0">
                  {categoryIcons[task.category] || "📋"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-800 truncate">
                    {task.title}
                  </p>
                  <p className="text-xs text-stone-400">
                    {task.dueDate ? formatDueLabel(task.dueDate) : "No date"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="text-center pt-2">
        <button
          onClick={() => router.push("/")}
          className="px-8 py-3 bg-sage-600 text-white font-semibold rounded-xl hover:bg-sage-700 transition-colors text-base shadow-sm"
        >
          Go to Dashboard →
        </button>
      </div>
    </div>
  );
}
