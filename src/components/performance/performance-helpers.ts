import dayjs from "dayjs";

export function initials(name: string): string {
  return name
    .split(" ")
    .slice(-2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function formatShift(iso: string | null): string {
  if (!iso) return "--";
  return dayjs(iso).format("HH:mm DD/MM");
}

export function completionColor(rate: number): string {
  if (rate >= 70) return "#10b981";
  if (rate >= 40) return "#f59e0b";
  return "#ef4444";
}
