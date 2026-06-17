import { KpiPeriod, KpiRecentTask } from "@/services/api/kpi";

export const COMMANDER_ROLES = ["CHI_HUY", "TO_TRUONG", "ADMIN"];

export const PERIOD_LABELS: Record<KpiPeriod, string> = {
  week: "Tuần",
  month: "Tháng",
  quarter: "Quý",
  year: "Năm",
};

export const ROLE_LABELS: Record<string, string> = {
  TO_TRUONG: "Tổ trưởng",
  DQTT: "Thành viên",
  DQCD: "DQ Cơ động",
  CHI_HUY: "Chỉ huy",
};

export const STATUS_LABELS: Record<string, string> = {
  on_duty: "Đang trực",
  on_leave: "Nghỉ phép",
  training: "Huấn luyện",
  other: "Khác",
};

export const STATUS_COLORS: Record<string, string> = {
  on_duty: "#4caf50",
  training: "#9e9e9e",
  on_leave: "#ff9800",
  other: "#424242",
};

export const TASK_STATUS_LABEL: Record<KpiRecentTask["status"], string> = {
  pending: "Chờ xử lý",
  in_progress: "Đang làm",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
};

export const TASK_STATUS_COLORS: Record<
  KpiRecentTask["status"],
  { bg: string; text: string }
> = {
  pending: { bg: "#f1f5f9", text: "#475569" },
  in_progress: { bg: "#dbeafe", text: "#1d4ed8" },
  completed: { bg: "#d1fae5", text: "#065f46" },
  cancelled: { bg: "#fee2e2", text: "#b91c1c" },
};
