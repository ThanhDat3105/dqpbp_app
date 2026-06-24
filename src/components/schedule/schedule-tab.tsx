import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/context/AuthContext";
import {
  OfficeColumn,
  ScheduleRow,
  WeekSchedule,
  formatDayMonth,
  getMonday,
  getSchedule,
  toIsoDate,
} from "@/services/api/schedule";
import { CalendarPlus, ChevronLeft, ChevronRight } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScheduleCreateSheet } from "./schedule-create-sheet";
import { ScheduleDayRow } from "./schedule-day-row";
import { ScheduleFormSheet } from "./schedule-form-sheet";

const DAY_LABELS = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"];
const EDITABLE_ROLES = new Set(["CHI_HUY", "TO_TRUONG"]);

const FIXED_OFFICE: OfficeColumn[] = [
  { code: "hdnd_ubnd", label: "Trực HĐND – UBND" },
  { code: "du", label: "Trực Đảng ủy" },
  { code: "pktht", label: "Trực PKTHT" },
];

function getWeekInfo(refDate: Date) {
  const monday = getMonday(new Date(refDate));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const d = new Date(Date.UTC(monday.getFullYear(), monday.getMonth(), monday.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNumber = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);

  const todayMonday = getMonday(new Date());
  const isCurrentWeek =
    monday.getFullYear() === todayMonday.getFullYear() &&
    monday.getMonth() === todayMonday.getMonth() &&
    monday.getDate() === todayMonday.getDate();

  return {
    weekNumber,
    monday,
    sunday,
    label: `${formatDayMonth(monday)} – ${formatDayMonth(sunday)}/${sunday.getFullYear()}`,
    isCurrentWeek,
  };
}

function countAssigned(row: ScheduleRow, officeColumns: OfficeColumn[]): number {
  const allOffice = (() => {
    const fixedCodes = new Set(FIXED_OFFICE.map((c) => c.code));
    const extras = officeColumns.filter((c) => !fixedCodes.has(c.code));
    return [...FIXED_OFFICE, ...extras];
  })();

  let count = 0;
  if (row.commander?.trim()) count++;
  if (row.duty_officer?.trim()) count++;
  if (row.document_officer?.trim()) count++;
  if (row.internal_affairs?.trim()) count++;
  if (row.meal_duty?.trim()) count++;
  if (row.dqtt_leader?.trim()) count++;
  if (row.dqcd_patrol?.length > 0) count++;
  for (const col of allOffice) {
    if (row.office_duties?.[col.code]?.trim()) count++;
  }
  return count;
}

export function ScheduleTab() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const canEdit = EDITABLE_ROLES.has(user?.role ?? "");
  const canCreate = user?.role !== "DQTT";

  const [refDate, setRefDate] = useState(new Date());
  const [schedule, setSchedule] = useState<WeekSchedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [editingRow, setEditingRow] = useState<ScheduleRow | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchSchedule = useCallback(async (date: Date) => {
    setLoading(true);
    setSchedule(null);
    try {
      const data = await getSchedule(toIsoDate(date));
      setSchedule({ ...data, officeColumns: data.officeColumns ?? [] });
      // Auto-expand today's row
      if (data.rows) {
        const today = toIsoDate(new Date());
        const idx = data.rows.findIndex((r: ScheduleRow) => r.date === today);
        setExpandedIndex(idx >= 0 ? idx : 0);
      }
    } catch {
      showToast("Không thể tải lịch trực.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSchedule(refDate); }, [refDate, fetchSchedule]);

  const { weekNumber, label: weekLabel, isCurrentWeek } = getWeekInfo(refDate);

  const allOfficeColumns = schedule?.officeColumns ?? [];
  const totalFields = 7 + allOfficeColumns.length + FIXED_OFFICE.filter(
    (f) => !allOfficeColumns.find((c) => c.code === f.code)
  ).length;

  const rows = schedule?.rows ?? [];

  return (
    <View style={[s.root]}>
      {/* Week nav header */}
      <View style={s.weekHeader}>
        <Pressable onPress={() => setRefDate((p) => { const d = new Date(p); d.setDate(d.getDate() - 7); return d; })}
          hitSlop={10} style={s.navBtn}>
          <ChevronLeft size={20} color="#374151" />
        </Pressable>

        <View style={s.weekCenter}>
          <ThemedText style={s.weekTitle}>Lịch trực Tuần {weekNumber}</ThemedText>
          <ThemedText style={s.weekSub}>{weekLabel}</ThemedText>
        </View>

        <Pressable onPress={() => setRefDate((p) => { const d = new Date(p); d.setDate(d.getDate() + 7); return d; })}
          hitSlop={10} style={s.navBtn}>
          <ChevronRight size={20} color="#374151" />
        </Pressable>
      </View>

      {/* Action bar */}
      <View style={s.actionBar}>
        {!isCurrentWeek && (
          <Pressable style={s.todayBtn} onPress={() => setRefDate(new Date())}>
            <ThemedText style={s.todayBtnText}>Tuần hiện tại</ThemedText>
          </Pressable>
        )}
        <ThemedText style={s.tapHint}>Bấm vào ngày để xem / sửa các vị trí trực</ThemedText>
        {canCreate && (
          <Pressable style={s.createBtn} onPress={() => setCreateOpen(true)}>
            <CalendarPlus size={15} color="#2563eb" />
          </Pressable>
        )}
      </View>

      {/* Content */}
      {loading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color="#3b4a2e" />
        </View>
      ) : rows.length === 0 ? (
        <View style={s.empty}>
          <Text style={s.emptyIcon}>📅</Text>
          <ThemedText style={s.emptyTitle}>Chưa có lịch trực</ThemedText>
          <ThemedText style={s.emptyDesc}>
            Tuần này chưa có lịch trực.{canCreate ? "\nNhấn + để tạo lịch tuần." : ""}
          </ThemedText>
        </View>
      ) : (
        <ScrollView
          style={s.scroll}
          contentContainerStyle={{ padding: 14, paddingBottom: insets.bottom + 80 }}
          showsVerticalScrollIndicator={false}
        >
          {rows.map((row, i) => {
            const rowDate = new Date(row.date + "T00:00:00");
            const dateLabel = formatDayMonth(rowDate);
            const isToday = row.date === toIsoDate(new Date());
            const assigned = countAssigned(row, allOfficeColumns);

            return (
              <ScheduleDayRow
                key={row.date}
                row={row}
                dayLabel={DAY_LABELS[i] ?? `Ngày ${i + 1}`}
                dateLabel={dateLabel}
                isToday={isToday}
                isExpanded={expandedIndex === i}
                canEdit={canEdit}
                officeColumns={allOfficeColumns}
                assignedCount={assigned}
                totalCount={totalFields}
                onToggle={() => setExpandedIndex((prev) => (prev === i ? null : i))}
                onEdit={() => { setEditingRow(row); setEditingIndex(i); }}
              />
            );
          })}
        </ScrollView>
      )}

      {/* Edit sheet */}
      <ScheduleFormSheet
        visible={!!editingRow}
        row={editingRow}
        dayLabel={editingIndex !== null ? (DAY_LABELS[editingIndex] ?? "") : ""}
        officeColumns={allOfficeColumns}
        onClose={() => { setEditingRow(null); setEditingIndex(null); }}
        onSaved={(updated) => {
          setSchedule((prev) => {
            if (!prev) return prev;
            return { ...prev, rows: prev.rows.map((r) => r.date === updated.date ? updated : r) };
          });
          setEditingRow(null);
          setEditingIndex(null);
          showToast("Đã cập nhật lịch trực thành công.");
        }}
        onError={(msg) => showToast(msg, "error")}
      />

      {/* Create sheet */}
      <ScheduleCreateSheet
        visible={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => fetchSchedule(refDate)}
        onSuccess={(msg) => showToast(msg)}
        onError={(msg) => showToast(msg, "error")}
      />

      {/* Toast */}
      {toast && (
        <View style={[s.toast, { bottom: insets.bottom + 24 }, toast.type === "error" && s.toastError]}>
          <Text style={s.toastText}>{toast.msg}</Text>
        </View>
      )}
    </View>
  );
}

const OLIVE = "#3b4a2e";

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f9fafb" },
  weekHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  navBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  weekCenter: { alignItems: "center", flex: 1 },
  weekTitle: { fontSize: 15, fontWeight: "800", color: "#111827" },
  weekSub: { fontSize: 12, color: "#6b7280", marginTop: 1 },
  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#f0f4eb",
    gap: 8,
  },
  todayBtn: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  todayBtnText: { fontSize: 12, fontWeight: "600", color: "#374151" },
  tapHint: { flex: 1, fontSize: 11, color: "#6b7280", fontStyle: "italic" },
  createBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#dbeafe",
    alignItems: "center",
    justifyContent: "center",
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10, padding: 40 },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: "#374151" },
  emptyDesc: { fontSize: 13, color: "#9ca3af", textAlign: "center", lineHeight: 20 },
  scroll: { flex: 1 },
  toast: {
    position: "absolute",
    left: 20,
    right: 20,
    backgroundColor: "#1f2937",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  toastError: { backgroundColor: "#dc2626" },
  toastText: { color: "#fff", fontSize: 14, fontWeight: "500" },
});
