import { axiosInstance } from "@/lib/axios.config";

export interface CalendarTask {
  task_id: number;
  title: string;
  due_date: string;
  start_date?: string;
  status: "pending" | "completed";
  team: string;
}

export interface CalendarActivity {
  activity_id: number;
  activity_name: string;
  work_group: string;
  tasks: CalendarTask[];
}

export interface CalendarTaskItem {
  task_id: number;
  title: string;
  due_date: string;
  start_date?: string;
  status: "pending" | "completed";
  activity_id: number;
}

export type CalendarMetaData = Record<
  string,
  CalendarActivity[] | CalendarTaskItem[]
>;

function getDateKey(raw: string): string {
  return raw.split(" ")[0] ?? raw;
}

function normalizeCalendarData(rawData: unknown): CalendarMetaData {
  const normalized: CalendarMetaData = {};
  if (!rawData || typeof rawData !== "object") return normalized;

  for (const [key, items] of Object.entries(rawData as Record<string, unknown>)) {
    if (!Array.isArray(items)) continue;
    const normalizedKey = getDateKey(key);
    if (!normalized[normalizedKey]) {
      normalized[normalizedKey] = [] as CalendarActivity[];
    }
    (normalized[normalizedKey] as unknown[]).push(...items);
  }

  return normalized;
}

export async function fetchCalendar(
  view: "day" | "week" | "month",
  dateStr: string,
): Promise<CalendarMetaData> {
  const res = await axiosInstance.get("/api/calendar", {
    params: { view, date: dateStr },
  });
  return normalizeCalendarData(res.data?.metaData ?? {});
}

export function isActivityList(
  data: CalendarActivity[] | CalendarTaskItem[],
): data is CalendarActivity[] {
  if (!data || data.length === 0) return false;
  return "activity_id" in data[0] && "activity_name" in data[0];
}
