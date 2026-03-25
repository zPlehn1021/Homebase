"use client";

import { toast } from "sonner";
import { useAdminBugReports } from "@/lib/hooks/use-admin-bug-reports";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { EmptyState } from "@/components/ui/empty-state";

export default function AdminBugReportsPage() {
  const { reports, loading, markFixed } = useAdminBugReports();

  const openReports = reports.filter((r) => r.status === "open");
  const fixedReports = reports.filter((r) => r.status === "fixed");

  const handleMarkFixed = async (id: number) => {
    try {
      await markFixed(id);
      toast.success("Bug marked as fixed");
    } catch {
      toast.error("Failed to update bug report");
    }
  };

  return (
    <div className="space-y-10">
      {/* Open */}
      <section>
        <h2 className="text-lg font-bold text-stone-900 mb-4">
          Open Issues
        </h2>
        {loading ? (
          <LoadingSkeleton count={2} />
        ) : openReports.length === 0 ? (
          <EmptyState
            icon="🎉"
            title="No open bugs"
            description="All reported bugs have been fixed."
          />
        ) : (
          <div className="space-y-3">
            {openReports.map((r) => (
              <div
                key={r.id}
                className="bg-white border border-stone-200 rounded-xl p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-stone-800">
                      {r.title}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 whitespace-pre-wrap">
                      {r.description}
                    </p>
                    <p className="text-xs text-stone-400 mt-2">
                      By {r.submitterName} &middot;{" "}
                      {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleMarkFixed(r.id)}
                    className="px-3 py-1.5 rounded-lg bg-sage-600 text-white text-xs font-medium hover:bg-sage-700 transition-colors shrink-0"
                  >
                    Mark Fixed
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Fixed */}
      <section>
        <h2 className="text-lg font-bold text-stone-900 mb-4">
          Fixed
        </h2>
        {loading ? (
          <LoadingSkeleton count={2} />
        ) : fixedReports.length === 0 ? (
          <EmptyState
            icon="🐛"
            title="No fixed bugs yet"
            description="Fixed bug reports will appear here."
          />
        ) : (
          <div className="space-y-3">
            {fixedReports.map((r) => (
              <div
                key={r.id}
                className="bg-white border border-stone-200 rounded-xl p-5 opacity-75"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-stone-800">
                      {r.title}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                      Fixed
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1 whitespace-pre-wrap">
                    {r.description}
                  </p>
                  <p className="text-xs text-stone-400 mt-2">
                    By {r.submitterName} &middot;{" "}
                    {new Date(r.createdAt).toLocaleDateString()}
                    {r.resolvedAt && (
                      <>
                        {" "}&middot; Fixed{" "}
                        {new Date(r.resolvedAt).toLocaleDateString()}
                      </>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
