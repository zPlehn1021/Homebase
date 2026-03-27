"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import type { User } from "@/lib/hooks/use-user";

export function AccountSection({
  user,
  onSave,
  saving,
}: {
  user: User;
  onSave: (updates: Record<string, unknown>) => Promise<void>;
  saving: boolean;
}) {
  const [name, setName] = useState(user.name || "");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const nameIsDirty = name.trim() !== (user.name || "");

  const handleSaveName = async () => {
    await onSave({ name: name.trim() });
  };

  const handleDelete = async () => {
    if (deleteText !== "DELETE") return;
    setDeleting(true);
    try {
      const res = await fetch("/api/user/delete", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete account");
      await signOut({ callbackUrl: "/login" });
    } catch {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-cream rounded-2xl border border-stone-200 p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-stone-900">Account</h2>
        <p className="text-sm text-stone-500 mt-0.5">
          Manage your account details.
        </p>
      </div>

      {/* Display Name */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-stone-700">
          Display name
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="flex-1 px-3 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-sage-200 focus:border-sage-300"
          />
          {nameIsDirty && (
            <button
              onClick={handleSaveName}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl bg-sage-600 text-white text-sm font-medium hover:bg-sage-700 disabled:opacity-50 transition-colors"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-stone-700">Email</label>
        <div className="px-3 py-2.5 rounded-xl border border-stone-100 bg-stone-50 text-sm text-stone-600">
          {user.email}
        </div>
        <p className="text-xs text-stone-400">
          Managed by your sign-in provider.
        </p>
      </div>

      {/* Status */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-stone-700">
          Status
        </label>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sage-50 border border-sage-200 text-xs font-medium text-sage-700">
            <span className="w-1.5 h-1.5 rounded-full bg-sage-500" />
            Homebase
          </span>
          {user.hasDonated && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-medium text-amber-700">
              &#9825; Supporter
            </span>
          )}
        </div>
        {!user.hasDonated && (
          <a
            href={process.env.NEXT_PUBLIC_LEMONSQUEEZY_DONATION_URL || "/#pricing"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-sage-600 hover:text-sage-700 font-medium"
          >
            Support Homebase &rarr;
          </a>
        )}
      </div>

      {/* Member Since */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-stone-700">
          Member since
        </label>
        <p className="text-sm text-stone-600">
          {new Date(user.createdAt).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Danger Zone */}
      <div className="border-t border-stone-200 pt-6 space-y-3">
        <h3 className="text-sm font-semibold text-rose-700">Danger zone</h3>
        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 rounded-xl border border-rose-200 text-rose-600 text-sm font-medium hover:bg-rose-50 transition-colors"
          >
            Delete my account
          </button>
        ) : (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 space-y-3">
            <p className="text-sm text-rose-800">
              This will permanently delete your account, all tasks, and history.
              This action cannot be undone.
            </p>
            <div>
              <label className="block text-xs font-medium text-rose-700 mb-1">
                Type DELETE to confirm
              </label>
              <input
                type="text"
                value={deleteText}
                onChange={(e) => setDeleteText(e.target.value)}
                placeholder="DELETE"
                className="w-full px-3 py-2.5 rounded-xl border border-rose-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                disabled={deleteText !== "DELETE" || deleting}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-sm font-medium hover:bg-rose-700 disabled:opacity-50 transition-colors"
              >
                {deleting ? "Deleting..." : "Permanently Delete"}
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteText("");
                }}
                className="px-4 py-2 rounded-xl border border-stone-200 text-stone-600 text-sm font-medium hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
