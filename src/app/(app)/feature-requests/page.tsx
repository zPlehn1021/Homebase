"use client";

import { useState } from "react";
import { useFeatureRequests } from "@/lib/hooks/use-feature-requests";
import { FeatureRequestCard } from "@/components/feature-requests/feature-request-card";
import { SubmitRequestModal } from "@/components/feature-requests/submit-request-modal";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { EmptyState } from "@/components/ui/empty-state";

const statusLabels: Record<string, { label: string; className: string }> = {
  pending: {
    label: "Pending Review",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  voting: {
    label: "Open for Voting",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  community_approved: {
    label: "Community Approved",
    className: "bg-green-50 text-green-700 border-green-200",
  },
  completed: {
    label: "Completed",
    className: "bg-stone-50 text-stone-600 border-stone-200",
  },
};

export default function FeatureRequestsPage() {
  const [tab, setTab] = useState<"voting" | "my">("voting");
  const [showModal, setShowModal] = useState(false);

  const voting = useFeatureRequests("voting");
  const my = useFeatureRequests("my");
  const active = tab === "voting" ? voting : my;

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">
            Feature Requests
          </h1>
          <p className="text-sm text-stone-500 mt-1">
            Suggest features and vote on what gets built next.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-sage-600 text-white text-sm font-medium hover:bg-sage-700 transition-colors"
        >
          Submit a Request
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-stone-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab("voting")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "voting"
              ? "bg-white text-stone-800 shadow-sm"
              : "text-stone-500 hover:text-stone-700"
          }`}
        >
          Active Requests
        </button>
        <button
          onClick={() => setTab("my")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "my"
              ? "bg-white text-stone-800 shadow-sm"
              : "text-stone-500 hover:text-stone-700"
          }`}
        >
          My Submissions
        </button>
      </div>

      {/* Content */}
      {active.loading ? (
        <LoadingSkeleton count={3} />
      ) : tab === "voting" ? (
        voting.featureRequests.length === 0 ? (
          <EmptyState
            icon="💡"
            title="No active requests"
            description="Be the first to suggest a feature!"
            action={{
              label: "Submit a Request",
              onClick: () => setShowModal(true),
            }}
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {voting.featureRequests.map((r) => (
              <FeatureRequestCard
                key={r.id}
                request={r}
                onVote={voting.toggleVote}
              />
            ))}
          </div>
        )
      ) : my.featureRequests.length === 0 ? (
        <EmptyState
          icon="📝"
          title="No submissions yet"
          description="You haven't submitted any feature requests."
          action={{
            label: "Submit a Request",
            onClick: () => setShowModal(true),
          }}
        />
      ) : (
        <div className="space-y-2">
          {my.featureRequests.map((r) => {
            const badge = statusLabels[r.status];
            return (
              <div
                key={r.id}
                className="bg-white border border-stone-200 rounded-xl p-4 flex items-center justify-between"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-stone-800 truncate">
                    {r.title}
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5 truncate">
                    {r.description}
                  </p>
                </div>
                <span
                  className={`ml-3 shrink-0 text-xs font-medium px-2.5 py-1 rounded-full border ${badge.className}`}
                >
                  {badge.label}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <SubmitRequestModal
          onSubmit={async (input) => {
            await voting.submitRequest(input);
            my.refetch();
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
