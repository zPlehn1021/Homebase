"use client";

import { useTasks } from "@/lib/hooks/use-tasks";
import { useCompletions } from "@/lib/hooks/use-completions";
import { CostSummaryCards } from "@/components/costs/cost-summary-cards";
import { CategoryBreakdown } from "@/components/costs/category-breakdown";
import { CompletedCostsList } from "@/components/costs/completed-costs-list";
import { YearComparison } from "@/components/costs/year-comparison";
import { LoadingSkeleton, StatsSkeleton } from "@/components/ui/loading-skeleton";

export default function CostsPage() {
  const { tasks, loading: tasksLoading } = useTasks();
  const { completions, loading: completionsLoading } = useCompletions();
  const loading = tasksLoading || completionsLoading;

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
          Costs
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Track your home maintenance spending throughout the year.
        </p>
      </div>

      {loading ? (
        <>
          <StatsSkeleton />
          <LoadingSkeleton count={3} />
        </>
      ) : (
        <>
          <CostSummaryCards tasks={tasks} completions={completions} />

          <div className="grid gap-5 lg:grid-cols-2">
            <CategoryBreakdown completions={completions} />
            <YearComparison />
          </div>

          <CompletedCostsList completions={completions} />
        </>
      )}
    </div>
  );
}
