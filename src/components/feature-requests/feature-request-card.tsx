"use client";

import type { FeatureRequest } from "@/lib/types";

export function FeatureRequestCard({
  request,
  onVote,
}: {
  request: FeatureRequest;
  onVote: (id: number) => void;
}) {
  const voteCount = request.voteCount ?? 0;
  const totalActive = request.totalActiveUsers ?? 1;
  const threshold = Math.ceil(totalActive * 0.4);
  const progress = threshold > 0 ? Math.min(voteCount / threshold, 1) : 0;

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-stone-800">
          {request.title}
        </h3>
        <p className="text-xs text-stone-500 mt-1 line-clamp-2">
          {request.description}
        </p>
      </div>

      {request.submitterName && (
        <p className="text-xs text-stone-400">
          Suggested by {request.submitterName}
        </p>
      )}

      {/* Vote bar + button */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onVote(request.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            request.hasVoted
              ? "bg-sage-100 text-sage-700 border-sage-300"
              : "bg-white text-stone-400 border-stone-200 hover:border-sage-300 hover:text-sage-600"
          }`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill={request.hasVoted ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 2l1.5 3H12l-2.5 2 1 3L7 8.5 3.5 10l1-3L2 5h3.5z" />
          </svg>
          {voteCount} {voteCount === 1 ? "vote" : "votes"}
        </button>

        <div className="flex-1">
          <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-sage-500 rounded-full transition-all duration-300"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <p className="text-[10px] text-stone-400 mt-0.5">
            {voteCount}/{threshold} votes needed
          </p>
        </div>
      </div>
    </div>
  );
}
