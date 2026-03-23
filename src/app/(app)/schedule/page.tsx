"use client";

import { useState } from "react";
import { useTasks } from "@/lib/hooks/use-tasks";
import { CalendarHeader } from "@/components/schedule/calendar-header";
import { CalendarGrid } from "@/components/schedule/calendar-grid";
import { DayDetail } from "@/components/schedule/day-detail";
import { ListView } from "@/components/schedule/list-view";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";

export default function SchedulePage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { tasks, loading } = useTasks();

  const handlePrev = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
    setSelectedDate(null);
  };

  const handleNext = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
    setSelectedDate(null);
  };

  const handleToday = () => {
    setMonth(now.getMonth());
    setYear(now.getFullYear());
    setSelectedDate(null);
  };

  const selectedDayTasks = selectedDate
    ? tasks.filter((t) => t.dueDate === selectedDate)
    : [];

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-5">
      <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
        Schedule
      </h1>

      <CalendarHeader
        month={month}
        year={year}
        viewMode={viewMode}
        onPrev={handlePrev}
        onNext={handleNext}
        onToday={handleToday}
        onViewChange={setViewMode}
      />

      {loading ? (
        <LoadingSkeleton count={4} />
      ) : viewMode === "calendar" ? (
        <>
          <CalendarGrid
            month={month}
            year={year}
            tasks={tasks}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
          {selectedDate && (
            <DayDetail
              date={selectedDate}
              tasks={selectedDayTasks}
              onClose={() => setSelectedDate(null)}
            />
          )}
        </>
      ) : (
        <ListView tasks={tasks} month={month} year={year} />
      )}
    </div>
  );
}
