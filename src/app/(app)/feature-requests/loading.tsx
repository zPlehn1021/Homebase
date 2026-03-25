import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

export default function Loading() {
  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6">
      <div className="space-y-1">
        <div className="h-7 w-48 bg-stone-200 rounded animate-pulse" />
        <div className="h-4 w-72 bg-stone-100 rounded animate-pulse" />
      </div>
      <LoadingSkeleton count={3} />
    </div>
  );
}
