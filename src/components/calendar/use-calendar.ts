import { useCallback, useEffect, useRef, useState } from "react";
import { CalendarMetaData, fetchCalendar } from "@/services/api/calendar";

export type ViewMode = "day" | "week" | "month";

export function getDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday-based ISO
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

export function useCalendar() {
  const makeToday = () => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  };

  const [today] = useState<Date>(makeToday);
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [currentDate, setCurrentDate] = useState<Date>(makeToday);
  const [data, setData] = useState<CalendarMetaData>({});
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const load = useCallback(async (view: ViewMode, date: Date) => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setLoading(true);
    try {
      const result = await fetchCalendar(view, getDateStr(date));
      if (!ac.signal.aborted) setData(result);
    } catch {
      if (!ac.signal.aborted) setData({});
    } finally {
      if (!ac.signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(viewMode, currentDate);
    return () => abortRef.current?.abort();
  }, [viewMode, currentDate, load]);

  const navigate = useCallback(
    (dir: "prev" | "next") => {
      const delta = dir === "next" ? 1 : -1;
      setCurrentDate((prev) => {
        const d = new Date(prev);
        if (viewMode === "day") d.setDate(d.getDate() + delta);
        else if (viewMode === "week") d.setDate(d.getDate() + delta * 7);
        else d.setMonth(d.getMonth() + delta);
        return d;
      });
    },
    [viewMode],
  );

  const goToday = useCallback(() => {
    setCurrentDate(makeToday());
  }, []);

  const selectDay = useCallback((date: Date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    setCurrentDate(d);
    setViewMode("day");
  }, []);

  return {
    today,
    viewMode,
    setViewMode,
    currentDate,
    data,
    loading,
    navigate,
    goToday,
    selectDay,
  };
}
