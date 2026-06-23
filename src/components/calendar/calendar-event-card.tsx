import { ThemedText } from "@/components/themed-text";
import { Pressable, StyleSheet, View } from "react-native";
import { EventEntry } from "./calendar-event-utils";

const STATUS_CONFIG = {
  completed: {
    bg: "#16a34a",
    dot: "#bbf7d0",
    label: "Hoàn thành",
    labelBg: "#dcfce7",
    labelColor: "#15803d",
  },
  in_progress: {
    bg: "#2563eb",
    dot: "#bfdbfe",
    label: "Đang thực hiện",
    labelBg: "#dbeafe",
    labelColor: "#1d4ed8",
  },
  pending: {
    bg: "#d97706",
    dot: "#fde68a",
    label: "Chờ nhận",
    labelBg: "#fef3c7",
    labelColor: "#b45309",
  },
  overdue: {
    bg: "#dc2626",
    dot: "#fecaca",
    label: "Quá hạn",
    labelBg: "#fee2e2",
    labelColor: "#b91c1c",
  },
  activity: {
    bg: "#7c3aed",
    dot: "#ddd6fe",
    label: "Hoạt động",
    labelBg: "#ede9fe",
    labelColor: "#6d28d9",
  },
};

interface Props {
  event: EventEntry;
  onPress?: () => void;
}

function getStatusConfig(ev: EventEntry) {
  if (ev.isActivity) return STATUS_CONFIG.activity;
  if (ev.status === "completed") return STATUS_CONFIG.completed;
  const due = ev.dueDate ? new Date(ev.dueDate) : null;
  if (due && due < new Date() && (ev.status as string) !== "completed")
    return STATUS_CONFIG.overdue;
  return STATUS_CONFIG.pending;
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

export function CalendarEventCard({ event, onPress }: Props) {
  const cfg = getStatusConfig(event);

  return (
    <Pressable onPress={onPress} style={[s.card, { borderLeftColor: cfg.bg }]}>
      <View style={s.row}>
        <View style={[s.dot, { backgroundColor: cfg.bg }]} />
        <ThemedText style={s.title} numberOfLines={2}>
          {event.title}
        </ThemedText>
        <View style={[s.badge, { backgroundColor: cfg.labelBg }]}>
          <ThemedText style={[s.badgeText, { color: cfg.labelColor }]}>
            {cfg.label}
          </ThemedText>
        </View>
      </View>
      {event.subLabel && (
        <ThemedText style={s.sub} numberOfLines={1}>
          {event.subLabel}
        </ThemedText>
      )}
      {event.isActivity && event.taskCount !== undefined && (
        <ThemedText style={s.sub}>{event.taskCount} nhiệm vụ</ThemedText>
      )}
      {event.dueDate && (
        <View style={s.timeRow}>
          <ThemedText style={s.timeText}>
            {formatTime(event.dueDate)}
          </ThemedText>
          {event.startDate && (
            <ThemedText style={s.timeText}>
              — {formatTime(event.startDate)}
            </ThemedText>
          )}
        </View>
      )}
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  row: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 4, flexShrink: 0 },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    lineHeight: 20,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
    alignSelf: "flex-start",
    flexShrink: 0,
  },
  badgeText: { fontSize: 11, fontWeight: "600" },
  sub: { fontSize: 12, color: "#6b7280", marginTop: 4, marginLeft: 16 },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
    marginLeft: 16,
  },
  timeText: { fontSize: 11, color: "#9ca3af" },
});
