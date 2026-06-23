import {
  CalendarActivity,
  CalendarTaskItem,
  CalendarMetaData,
  isActivityList,
} from "@/services/api/calendar";
import { getDateStr } from "./use-calendar";

export interface EventEntry {
  id: string | number;
  taskId?: number;
  activity_id?: number;
  title: string;
  status?: "pending" | "completed";
  dueDate: string;
  startDate?: string;
  subLabel?: string;
  taskCount?: number;
  isActivity?: boolean;
  location?: string;
}

export function getEventsForDay(
  date: Date,
  data: CalendarMetaData,
  role: string,
): EventEntry[] {
  const key = getDateStr(date);
  const dayData = data[key];
  if (!dayData || dayData.length === 0) return [];

  const result: EventEntry[] = [];

  if (role === "CHI_HUY" && isActivityList(dayData)) {
    const acts = dayData as CalendarActivity[];
    const actMap = new Map<
      string,
      { activityId: number; tasks: CalendarActivity["tasks"] }
    >();

    for (const act of acts) {
      const existing = actMap.get(act.activity_name);
      if (existing) {
        existing.tasks.push(...act.tasks);
      } else {
        actMap.set(act.activity_name, {
          activityId: act.activity_id,
          tasks: [...act.tasks],
        });
      }
    }

    for (const [name, entry] of actMap.entries()) {
      if (entry.tasks.length === 0) continue;
      const earliest = entry.tasks.reduce((min, t) =>
        new Date(t.due_date) < new Date(min.due_date) ? t : min,
      );
      const startDates = entry.tasks
        .map((t) => t.start_date)
        .filter((d): d is string => Boolean(d));
      const earliestStart = startDates.length
        ? startDates.reduce((min, d) =>
            new Date(d) < new Date(min) ? d : min,
          )
        : undefined;

      result.push({
        id: name,
        title: name,
        taskCount: entry.tasks.length,
        dueDate: earliest.due_date,
        startDate: earliestStart,
        isActivity: true,
        activity_id: entry.activityId,
      });
    }
  } else if (isActivityList(dayData)) {
    const acts = dayData as CalendarActivity[];
    for (const act of acts) {
      for (const t of act.tasks) {
        result.push({
          id: t.task_id,
          taskId: t.task_id,
          title: t.title,
          status: t.status,
          dueDate: t.due_date,
          startDate: t.start_date,
          subLabel: act.activity_name,
          isActivity: false,
          activity_id: act.activity_id,
        });
      }
    }
  } else {
    for (const t of dayData as CalendarTaskItem[]) {
      result.push({
        id: t.task_id,
        taskId: t.task_id,
        title: t.title,
        status: t.status,
        dueDate: t.due_date,
        startDate: t.start_date,
        isActivity: false,
        activity_id: t.activity_id,
      });
    }
  }

  return result;
}

export function groupByHour(events: EventEntry[]): Record<number, EventEntry[]> {
  const map: Record<number, EventEntry[]> = {};
  for (let i = 0; i < 24; i++) map[i] = [];
  for (const ev of events) {
    const h = new Date(ev.dueDate).getHours();
    map[h]!.push(ev);
  }
  return map;
}

export function formatHour(h: number): string {
  return `${String(h).padStart(2, "0")}:00`;
}
