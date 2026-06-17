import { axiosInstance } from "@/lib/axios.config";

export type KpiPeriod = "week" | "month" | "quarter" | "year";

export interface KpiUser {
  user_id: number;
  name: string;
  role: "DQTT" | "DQCD";
  total_assigned: number;
  completed: number;
  on_time: number;
  cancelled: number;
  completion_rate: number;
  on_time_rate: number;
  department_id?: number;
}

export interface KpiSummary {
  total_assigned: number;
  completed: number;
  completed_on_time: number;
  completed_late: number;
  not_completed: number;
  overdue: number;
  cancelled: number;
}

export interface KpiRecentTask {
  id: number;
  title: string;
  activity: { id: number; name: string; work_type: string };
  due_date: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
}

export interface DeptKpiItem {
  department_id: number;
  department_code: string;
  department_name: string;
  completion_rate: number;
}

export async function getKpiSummary(params: {
  period?: KpiPeriod;
  user_id?: number;
}): Promise<KpiSummary> {
  const res = await axiosInstance.get("/api/kpi/summary", { params });
  return (
    res.data?.metaData?.summary ?? {
      total_assigned: 0,
      completed: 0,
      completed_on_time: 0,
      completed_late: 0,
      not_completed: 0,
      overdue: 0,
      cancelled: 0,
    }
  );
}

export async function getKpiList(params: {
  period: KpiPeriod;
  role?: string;
}): Promise<KpiUser[]> {
  const res = await axiosInstance.get("/api/kpi", { params });
  return res.data?.metaData?.data ?? [];
}

export async function getKpiUser(params: {
  user_id: number;
  period: KpiPeriod;
}): Promise<KpiUser | null> {
  const res = await axiosInstance.get("/api/kpi", { params });
  return res.data?.metaData?.data?.[0] ?? null;
}

export async function getRecentTasks(params: {
  user_id: number;
  limit?: number;
}): Promise<KpiRecentTask[]> {
  try {
    const res = await axiosInstance.get("/api/activities-task", {
      params: {
        assignee: params.user_id,
        limit: params.limit ?? 5,
        sort: "due_date_desc",
      },
    });

    const source =
      res.data?.data?.results ?? res.data?.data?.data ?? res.data?.data ?? [];

    if (!Array.isArray(source)) return [];

    return source.map((item: any, i: number) => ({
      id: Number(item.id ?? i + 1),
      title: String(item.title ?? "Nhiệm vụ"),
      activity: {
        id: Number(item.activity?.id ?? item.activity_id ?? i + 1),
        name: String(item.activity?.name ?? item.activity_name ?? "-"),
        work_type: String(item.activity?.work_type ?? item.work_type ?? "-"),
      },
      due_date: String(item.due_date ?? ""),
      status: (item.status ?? "pending") as KpiRecentTask["status"],
    }));
  } catch {
    return [];
  }
}

export async function getDeptKpiList(params: {
  period: KpiPeriod;
}): Promise<DeptKpiItem[]> {
  try {
    const res = await axiosInstance.get("/api/kpi/by-department", { params });
    return res.data?.metaData?.data ?? [];
  } catch {
    return [];
  }
}
