"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useUser } from "@/lib/hooks/use-user";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { HomeProfileSection } from "@/components/settings/home-profile-section";
import { NotificationSection } from "@/components/settings/notification-section";
import { AccountSection } from "@/components/settings/account-section";
import { DataSection } from "@/components/settings/data-section";

export default function SettingsPage() {
  const { user, loading, updateUser } = useUser();
  const [saving, setSaving] = useState(false);

  const handleSave = async (updates: Record<string, unknown>) => {
    setSaving(true);
    try {
      await updateUser(updates as Parameters<typeof updateUser>[0]);
      toast.success("Settings saved");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
        <div className="space-y-1">
          <div className="h-7 w-32 bg-stone-200 rounded animate-pulse" />
          <div className="h-4 w-64 bg-stone-100 rounded animate-pulse" />
        </div>
        <LoadingSkeleton count={4} />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Settings</h1>
        <p className="text-sm text-stone-500 mt-1">
          Manage your home profile, notifications, and account.
        </p>
      </div>

      <HomeProfileSection user={user} onSave={handleSave} saving={saving} />
      <NotificationSection user={user} onSave={handleSave} saving={saving} />
      <AccountSection user={user} onSave={handleSave} saving={saving} />
      <DataSection />
    </div>
  );
}
