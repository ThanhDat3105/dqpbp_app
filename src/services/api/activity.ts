import { axiosInstance } from "@/lib/axios.config";

export interface ActivityInterface {
  id: string;
  name: string;
  work_type: string;
  department: string;
  start_date: string;
  end_date: string;
  location: string;
  document_number: string;
  status: "pending" | "in_progress" | "completed" | "cancelled" | string;
  attached_files: string[];
  created_by: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  tasks: TaskInterface[];
}

export interface TaskInterface {
  id: number;
  activity_id: string;
  title: string;
  team: string[];
  assignees: { id: string; name: string; department: string }[];
  start_date: string;
  due_date: string;
  notes: string;
  report_fields: { name: string; value: string }[];
  accepted_at: string | null;
  created_at: string;
  updated_at: string;
  status: "pending" | "in_progress" | "completed" | "cancelled" | string;
  requires_dqcd: boolean;
  require_media_report: boolean;
  media_files?: string[];
}

export interface CreateActivityPayload {
  name: string;
  work_type: string;
  department: string;
  start_date: string;
  end_date: string;
  location: string;
  document_number: string;
  attached_files: string[];
  tasks: {
    title: string;
    team: string[];
    assignees: string[];
    start_date: string;
    due_date: string;
    notes: string;
    report_fields: { name: string; value: string }[];
    accepted_at: string | null;
    created_at: string;
    updated_at: string;
    status: string;
    requires_dqcd: boolean;
    require_media_report: boolean;
  }[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedActivities {
  results: ActivityInterface[];
  page: number;
  limit: number;
  totalPages: number;
  total: number;
}

export const DEPARTMENT_LABELS: Record<string, string> = {
  administration_office: "Văn thư",
  advise: "Tham mưu",
  political_affairs: "Chính trị",
  logistics: "Hậu cần",
  mobilization_recruitment: "Động viên tuyển quân",
};

export const WORK_TYPE_LABELS: Record<string, string> = {
  suddenly: "Đột xuất",
  annual: "Định kỳ",
};

export function getDepartmentLabel(value: string): string {
  return DEPARTMENT_LABELS[value] ?? "Không xác định";
}

export function getWorkTypeLabel(value: string): string {
  return WORK_TYPE_LABELS[value] ?? "Không xác định";
}

export async function getActivities(params: {
  status?: string;
  month: number;
  year: number;
  page?: number;
  limit?: number;
}): Promise<PaginatedActivities> {
  const res = await axiosInstance.get("/api/activities", {
    params: {
      ...params,
      status: params.status === "all" ? undefined : params.status,
    },
  });
  return res.data.metaData;
}

export async function getActivityDetail(
  id: string,
): Promise<ActivityInterface> {
  const res = await axiosInstance.get(`/api/activities/${id}`);
  return res.data.metaData;
}

export async function updateTaskStatus(
  taskId: number,
  status: "pending" | "in_progress" | "completed",
  mediaFiles?: string[],
): Promise<void> {
  await axiosInstance.put(`/api/activities-task/${taskId}`, {
    status,
    ...(mediaFiles && mediaFiles.length > 0 ? { media_files: mediaFiles } : {}),
  });
}

export async function updateReportFields(
  activityId: string,
  taskId: string,
  reportFields: { name: string; value: string }[],
): Promise<void> {
  await axiosInstance.patch(
    `/api/activities-task/${activityId}/tasks/${taskId}`,
    {
      report_fields: reportFields,
    },
  );
}

export async function createActivity(
  payload: CreateActivityPayload,
): Promise<ActivityInterface> {
  const res = await axiosInstance.post("/api/activities", payload);
  return res.data.metaData ?? res.data;
}

export interface ActivityTemplateTask {
  title: string;
  team: string[];
  assignees: string[];
  notes: string;
  report_fields: { name: string; value: string }[];
  requires_dqcd: boolean;
  require_media_report: boolean;
}

export interface ActivityTemplate {
  id: number;
  name: string;
  work_type: string;
  department: string;
  location: string;
  document_number: string;
  tasks: ActivityTemplateTask[];
}

export async function getActivityTemplates(): Promise<ActivityTemplate[]> {
  const res = await axiosInstance.get("/api/activity-templates", {
    params: { status: "active", limit: 100 },
  });
  return res.data.metaData?.results ?? res.data?.results ?? [];
}

export async function getActivityTemplateById(
  id: number,
): Promise<ActivityTemplate> {
  const res = await axiosInstance.get(`/api/activity-templates/${id}`);
  return res.data.metaData ?? res.data;
}
