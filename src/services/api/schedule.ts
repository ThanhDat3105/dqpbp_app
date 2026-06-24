import { axiosInstance } from "@/lib/axios.config";

export interface OfficeColumn {
  code: string;
  label: string;
}

export interface ScheduleRow {
  date: string;
  commander: string;
  duty_officer: string;
  document_officer: string;
  internal_affairs: string;
  meal_duty: string;
  dqtt_leader: string;
  dqcd_patrol: string[];
  office_duties: Record<string, string>;
}

export interface WeekSchedule {
  officeColumns: OfficeColumn[];
  rows: ScheduleRow[];
  weekId?: string;
  weekNumber?: number;
  weekStart?: string;
  weekEnd?: string;
}

export interface CreateWeekResponse {
  success: boolean;
  weekStart: string;
  weekEnd: string;
  created: number;
  skipped: number;
}

export interface UpdateDayResponse {
  success: boolean;
  row: ScheduleRow;
}

export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getIsoWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function formatDayMonth(date: Date): string {
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export const getSchedule = async (date: string): Promise<WeekSchedule> => {
  const res = await axiosInstance.get(`/api/schedules?date=${date}`);
  return res.data;
};

export const createWeek = async (target: string): Promise<CreateWeekResponse> => {
  const res = await axiosInstance.post(`/api/schedules/week`, { target });
  return res.data;
};

export const updateDay = async (
  date: string,
  payload: Partial<ScheduleRow>,
): Promise<UpdateDayResponse> => {
  const res = await axiosInstance.patch(`/api/schedules/day/${date}`, payload);
  return res.data;
};

export const scheduleApi = { getSchedule, createWeek, updateDay };
