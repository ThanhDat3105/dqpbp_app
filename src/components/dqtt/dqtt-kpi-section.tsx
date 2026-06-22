import { ThemedText } from "@/components/themed-text";
import { KpiRecentTask, KpiSummary } from "@/services/api/kpi";
import dayjs from "dayjs";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const TASK_STATUS: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  completed: { label: "Hoàn thành", color: "#15803d", bg: "#f0fdf4" },
  in_progress: { label: "Đang thực hiện", color: "#1d4ed8", bg: "#eff6ff" },
  pending: { label: "Chờ thực hiện", color: "#374151", bg: "#f9fafb" },
  cancelled: { label: "Đã hủy", color: "#dc2626", bg: "#fef2f2" },
};

function KpiStat({
  label,
  value,
  color,
  bg,
}: {
  label: string;
  value: string;
  color: string;
  bg: string;
}) {
  return (
    <View style={[s.kpiStat, { backgroundColor: bg }]}>
      <ThemedText style={s.kpiStatLabel}>{label}</ThemedText>
      <ThemedText style={[s.kpiStatValue, { color }]}>{value}</ThemedText>
    </View>
  );
}

export function DqttKpiSection({
  kpi,
  loading,
}: {
  kpi: KpiSummary | null;
  loading: boolean;
}) {
  if (loading)
    return (
      <View style={s.center}>
        <ActivityIndicator color="#556B2F" />
      </View>
    );
  if (!kpi) return null;

  const rate =
    kpi.total_assigned > 0
      ? Math.round((kpi.completed / kpi.total_assigned) * 100)
      : 0;

  return (
    <View style={s.grid}>
      <KpiStat
        label="Tổng NV"
        value={String(kpi.total_assigned)}
        color="#111827"
        bg="#f9fafb"
      />
      <KpiStat
        label="Hoàn thành"
        value={String(kpi.completed)}
        color="#15803d"
        bg="#f0fdf4"
      />
      <KpiStat
        label="Đúng hạn"
        value={String(kpi.completed_on_time)}
        color="#1d4ed8"
        bg="#eff6ff"
      />
      <KpiStat
        label="Tỉ lệ HT"
        value={`${rate}%`}
        color={rate >= 70 ? "#15803d" : rate >= 40 ? "#d97706" : "#dc2626"}
        bg={rate >= 70 ? "#f0fdf4" : rate >= 40 ? "#fffbeb" : "#fef2f2"}
      />
    </View>
  );
}

export function DqttTaskList({ tasks }: { tasks: KpiRecentTask[] }) {
  if (tasks.length === 0) return null;
  const fmt = (iso: string) => (iso ? dayjs(iso).format("DD/MM/YYYY") : "---");

  return (
    <>
      {tasks.map((task) => {
        const ts = TASK_STATUS[task.status] ?? TASK_STATUS.pending;
        return (
          <View key={task.id} style={s.taskCard}>
            <View style={s.taskHeader}>
              <ThemedText style={s.taskTitle} numberOfLines={2}>
                {task.title}
              </ThemedText>
              <View style={[s.taskBadge, { backgroundColor: ts.bg }]}>
                <ThemedText style={[s.taskBadgeText, { color: ts.color }]}>
                  {ts.label}
                </ThemedText>
              </View>
            </View>
            <ThemedText style={s.taskMeta}>
              {task.activity.name} • Hạn: {fmt(task.due_date)}
            </ThemedText>
          </View>
        );
      })}
    </>
  );
}

const s = StyleSheet.create({
  center: { paddingVertical: 20, alignItems: "center" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 8 },
  kpiStat: {
    width: "47%",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
  },
  kpiStatLabel: {
    fontSize: 11,
    color: "#6b7280",
    fontWeight: "500",
    marginBottom: 4,
  },
  kpiStatValue: { fontSize: 20, fontWeight: "800" },
  taskCard: {
    marginTop: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 6,
  },
  taskTitle: { flex: 1, fontSize: 13, fontWeight: "600", color: "#111827" },
  taskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    flexShrink: 0,
  },
  taskBadgeText: { fontSize: 10, fontWeight: "700" },
  taskMeta: { fontSize: 11, color: "#6b7280" },
});
