"use client";

import { useState } from "react";
import type { User } from "@/lib/hooks/use-user";

const frequencyOptions = [
  { value: "day_of", label: "Day of" },
  { value: "3_days", label: "3 days before" },
  { value: "1_week", label: "1 week before" },
] as const;

export function NotificationSection({
  user,
  onSave,
  saving,
}: {
  user: User;
  onSave: (updates: Record<string, unknown>) => Promise<void>;
  saving: boolean;
}) {
  const [emailReminders, setEmailReminders] = useState(user.emailReminders);
  const [reminderFrequency, setReminderFrequency] = useState<string[]>(
    user.reminderFrequency || ["day_of"]
  );
  const [weeklyDigest, setWeeklyDigest] = useState(user.weeklyDigest);

  const isDirty =
    emailReminders !== user.emailReminders ||
    JSON.stringify(reminderFrequency) !==
      JSON.stringify(user.reminderFrequency || ["day_of"]) ||
    weeklyDigest !== user.weeklyDigest;

  const toggleFrequency = (value: string) => {
    setReminderFrequency((prev) =>
      prev.includes(value)
        ? prev.filter((f) => f !== value)
        : [...prev, value]
    );
  };

  const handleSave = async () => {
    await onSave({
      emailReminders,
      reminderFrequency,
      weeklyDigest,
    });
  };

  return (
    <div className="bg-cream rounded-2xl border border-stone-200 p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-stone-900">
          Notification Preferences
        </h2>
        <p className="text-sm text-stone-500 mt-0.5">
          Choose how and when you want to be reminded about tasks.
        </p>
      </div>

      {/* Email Reminders Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-stone-700">Email reminders</p>
          <p className="text-xs text-stone-500 mt-0.5">
            Get notified about upcoming maintenance tasks
          </p>
        </div>
        <button
          onClick={() => setEmailReminders(!emailReminders)}
          className={`
            relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full
            border-2 border-transparent transition-colors duration-200
            ${emailReminders ? "bg-sage-600" : "bg-stone-200"}
          `}
          role="switch"
          aria-checked={emailReminders}
        >
          <span
            className={`
              pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow
              transform transition-transform duration-200
              ${emailReminders ? "translate-x-5" : "translate-x-0"}
            `}
          />
        </button>
      </div>

      {/* Reminder Frequency */}
      {emailReminders && (
        <div className="space-y-3">
          <label className="text-sm font-semibold text-stone-700">
            Reminder timing
          </label>
          <div className="flex flex-wrap gap-2">
            {frequencyOptions.map((opt) => {
              const isSelected = reminderFrequency.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => toggleFrequency(opt.value)}
                  className={`
                    px-4 py-2 rounded-xl text-sm font-medium transition-all
                    ${
                      isSelected
                        ? "bg-sage-600 text-white shadow-sm"
                        : "bg-white border border-stone-200 text-stone-600 hover:border-sage-300"
                    }
                  `}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Weekly Digest Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-stone-700">Weekly digest</p>
          <p className="text-xs text-stone-500 mt-0.5">
            Receive a weekly summary of upcoming and overdue tasks
          </p>
        </div>
        <button
          onClick={() => setWeeklyDigest(!weeklyDigest)}
          className={`
            relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full
            border-2 border-transparent transition-colors duration-200
            ${weeklyDigest ? "bg-sage-600" : "bg-stone-200"}
          `}
          role="switch"
          aria-checked={weeklyDigest}
        >
          <span
            className={`
              pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow
              transform transition-transform duration-200
              ${weeklyDigest ? "translate-x-5" : "translate-x-0"}
            `}
          />
        </button>
      </div>

      {/* Schedule note */}
      <div className="bg-stone-50 rounded-xl px-4 py-3">
        <p className="text-xs text-stone-500">
          Reminders are sent daily at 8:00 AM EST. Weekly digests go out every
          Monday morning.
        </p>
      </div>

      {/* Save */}
      {isDirty && (
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-xl bg-sage-600 text-white text-sm font-medium hover:bg-sage-700 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
}
