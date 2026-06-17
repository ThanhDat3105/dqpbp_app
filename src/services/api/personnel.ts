import { axiosInstance } from "@/lib/axios.config";

export interface PersonnelOverview {
  total_users: number;
  total_departments: number;
  alerts: number;
  readiness_percent: number;
}

export interface DeptItem {
  department_id: number;
  department_code: string;
  department_name: string;
  total: number;
}

export interface StatusItem {
  status: string;
  count: number;
  percent: number;
}

export interface PersonnelItem {
  id: number;
  name: string;
  role: string;
  status: string;
  shift_start_at: string | null;
  department_id: number;
  department_code: string;
  department_name: string;
}

export async function getPersonnelOverview(): Promise<PersonnelOverview> {
  const res = await axiosInstance.get("/api/personnel/overview");
  return res.data.metaData;
}

export async function getPersonnelByDept(): Promise<DeptItem[]> {
  const res = await axiosInstance.get("/api/personnel/by-department");
  return res.data.metaData.data ?? [];
}

export async function getPersonnelStatusBreakdown(): Promise<{
  total: number;
  breakdown: StatusItem[];
}> {
  const res = await axiosInstance.get("/api/personnel/status-breakdown");
  return res.data.metaData;
}

export async function getPersonnelList(params: {
  status?: string;
  role?: string;
  limit?: number;
}): Promise<PersonnelItem[]> {
  const res = await axiosInstance.get("/api/personnel/list", { params });
  return res.data.metaData.data ?? [];
}
