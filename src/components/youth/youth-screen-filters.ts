export type FilterValue = "all" | "registered" | "unregistered";

export const FILTER_LABELS: Record<FilterValue, string> = {
  all: "Tất cả",
  registered: "Đã hoàn thành",
  unregistered: "Chưa hoàn thành",
};
