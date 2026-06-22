import dayjs from "dayjs";

export function getDeadlineDisplay(
  endDate: string,
  completedAt: string | null,
): { text: string; color: string } {
  const end = dayjs(endDate).startOf("day");

  if (completedAt) {
    const completed = dayjs(completedAt).startOf("day");
    const diff = completed.diff(end, "day");
    if (diff > 0) return { text: `Hoàn thành trễ ${diff} ngày`, color: "#ef4444" };
    if (diff === 0) return { text: "Hoàn thành đúng hạn", color: "#059669" };
    return { text: `Hoàn thành sớm ${Math.abs(diff)} ngày`, color: "#059669" };
  }

  const today = dayjs().startOf("day");
  const diff = today.diff(end, "day");
  if (diff > 0) return { text: `Quá hạn ${diff} ngày`, color: "#ef4444" };
  if (diff === 0) return { text: "Hạn hôm nay", color: "#f59e0b" };
  return { text: `Còn ${Math.abs(diff)} ngày`, color: "#2563eb" };
}

export function formatMonthYear(date: Date): string {
  return dayjs(date).format("MM/YYYY");
}

export function calcProgress(tasks: { status: string }[]): number {
  if (!tasks.length) return 0;
  return Math.round(
    (tasks.filter((t) => t.status === "completed").length * 100) / tasks.length,
  );
}
