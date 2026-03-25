"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminRecoverPage() {
  const router = useRouter();
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Recovery failed");
        return;
      }

      router.push("/admin");
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-white flex items-center justify-center p-4">
      <div className="max-w-sm w-full">
        <div className="bg-white border border-stone-200 rounded-2xl p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-xl font-bold text-stone-900">
              Admin Recovery
            </h1>
            <p className="text-sm text-stone-500 mt-1">
              Enter your recovery secret to create a new session.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="secret"
                className="block text-sm font-medium text-stone-700 mb-1"
              >
                Recovery Secret
              </label>
              <input
                id="secret"
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Enter your ADMIN_RECOVERY_SECRET"
                required
                className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-transparent"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !secret}
              className="w-full px-4 py-2.5 rounded-xl bg-sage-600 text-white font-semibold hover:bg-sage-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? "Recovering..." : "Recover Access"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-stone-400 mt-4">
          <a href="/login" className="hover:text-stone-600 transition-colors">
            Try normal sign-in instead
          </a>
        </p>
      </div>
    </div>
  );
}
