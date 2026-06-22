export const STATUS_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { value: "pending", label: "Chờ nhận" },
  { value: "in_progress", label: "Đang thực hiện" },
  { value: "completed", label: "Hoàn thành" },
  { value: "overdue", label: "Quá hạn" },
];

export const STATUS_CONFIG: Record<
  string,
  { bg: string; dot: string; text: string; label: string }
> = {
  pending: { bg: "#fef9c3", dot: "#ca8a04", text: "#854d0e", label: "Chờ nhận" },
  in_progress: { bg: "#dbeafe", dot: "#2563eb", text: "#1e40af", label: "Đang thực hiện" },
  completed: { bg: "#d1fae5", dot: "#059669", text: "#065f46", label: "Hoàn thành" },
  cancelled: { bg: "#fee2e2", dot: "#dc2626", text: "#7f1d1d", label: "Đã hủy" },
  overdue: { bg: "#fee2e2", dot: "#dc2626", text: "#7f1d1d", label: "Quá hạn" },
};

export const DEPARTMENT_OPTIONS = [
  { value: "all", label: "Tất cả" },
  { value: "administration_office", label: "Văn thư" },
  { value: "advise", label: "Tham mưu" },
  { value: "political_affairs", label: "Chính trị" },
  { value: "logistics", label: "Hậu cần" },
  { value: "mobilization_recruitment", label: "Động viên" },
];
