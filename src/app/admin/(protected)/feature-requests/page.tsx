"use client";

import { toast } from "sonner";
import { useAdminFeatureRequests } from "@/lib/hooks/use-admin-feature-requests";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { EmptyState } from "@/components/ui/empty-state";

export default function AdminFeatureRequestsPage() {
  const pending = useAdminFeatureRequests("pending");
  const approved = useAdminFeatureRequests("community_approved");

  const handleReview = async (
    id: number,
    action: "accept" | "deny" | "complete",
    refetch?: () => void
  ) => {
    try {
      if (action === "accept") {
        await pending.reviewRequest(id, action);
        toast.success("Request accepted — now open for voting");
      } else if (action === "deny") {
        await pending.reviewRequest(id, action);
        toast.success("Request denied");
      } else {
        await approved.reviewRequest(id, action);
        toast.success("Feature marked as completed");
      }
    } catch {
      toast.error("Action failed");
    }
  };

  return (
    <div className="space-y-10">
      {/* Pending Review */}
      <section>
        <h2 className="text-lg font-bold text-stone-900 mb-4">
          Pending Review
        </h2>
        {pending.loading ? (
          <LoadingSkeleton count={2} />
        ) : pending.requests.length === 0 ? (
          <EmptyState
            icon="📭"
            title="No pending requests"
            description="All feature requests have been reviewed."
          />
        ) : (
          <div className="space-y-3">
            {pending.requests.map((r) => (
              <div
                key={r.id}
                className="bg-white border border-stone-200 rounded-xl p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-stone-800">
                      {r.title}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1">
                      {r.description}
                    </p>
                    <p className="text-xs text-stone-400 mt-2">
                      By {r.submitterName} &middot;{" "}
                      {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleReview(r.id, "accept")}
                      className="px-3 py-1.5 rounded-lg bg-sage-600 text-white text-xs font-medium hover:bg-sage-700 transition-colors"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReview(r.id, "deny")}
                      className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 text-xs font-medium border border-rose-200 hover:bg-rose-100 transition-colors"
                    >
                      Deny
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Community Approved */}
      <section>
        <h2 className="text-lg font-bold text-stone-900 mb-4">
          Community Approved
        </h2>
        {approved.loading ? (
          <LoadingSkeleton count={2} />
        ) : approved.requests.length === 0 ? (
          <EmptyState
            icon="🗳️"
            title="No community-approved features yet"
            description="Features that reach 40% of user votes will appear here."
          />
        ) : (
          <div className="space-y-3">
            {approved.requests.map((r) => (
              <div
                key={r.id}
                className="bg-white border border-stone-200 rounded-xl p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-stone-800">
                      {r.title}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1">
                      {r.description}
                    </p>
                    <p className="text-xs text-stone-400 mt-2">
                      {r.voteCount} votes &middot;{" "}
                      {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleReview(r.id, "complete")}
                    className="px-3 py-1.5 rounded-lg bg-sage-600 text-white text-xs font-medium hover:bg-sage-700 transition-colors shrink-0"
                  >
                    Mark Completed
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
