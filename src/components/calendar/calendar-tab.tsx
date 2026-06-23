import { ActivityDetailSheet } from "@/components/activities/activity-detail-sheet";
import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CalendarDayView } from "./calendar-day-view";
import { CalendarMonthView } from "./calendar-month-view";
import { CalendarWeekStrip } from "./calendar-week-strip";
import { ViewMode, isSameDay, useCalendar } from "./use-calendar";

const VIEW_OPTIONS: { label: string; value: ViewMode }[] = [
  { label: "Ngày", value: "day" },
  { label: "Tuần", value: "week" },
  { label: "Tháng", value: "month" },
];

const OLIVE = "#3b4a2e";

export function CalendarTab() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const role = user?.role ?? "DQTT";
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
    null,
  );

  const {
    today,
    viewMode,
    setViewMode,
    currentDate,
    data,
    loading,
    navigate,
    goToday,
    selectDay,
  } = useCalendar();

  const isToday = isSameDay(currentDate, today);

  const headerLabel = (() => {
    if (viewMode === "month") {
      return `Tháng ${currentDate.getMonth() + 1}, ${currentDate.getFullYear()}`;
    }
    return `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
  })();

  return (
    <View style={[s.root]}>
      {/* Top bar */}
      <View style={s.topBar}>
        <View style={s.topLeft}>
          <ThemedText style={s.topLabel}>{headerLabel}</ThemedText>
          {!isToday && (
            <Pressable onPress={goToday} style={s.todayBtn}>
              <ThemedText style={s.todayBtnText}>Hôm nay</ThemedText>
            </Pressable>
          )}
        </View>

        {/* View mode switcher */}
        <View style={s.viewSwitcher}>
          {VIEW_OPTIONS.map((opt) => (
            <Pressable
              key={opt.value}
              onPress={() => setViewMode(opt.value)}
              style={[s.viewBtn, viewMode === opt.value && s.viewBtnActive]}
            >
              <ThemedText
                style={[
                  s.viewBtnText,
                  viewMode === opt.value && s.viewBtnTextActive,
                ]}
              >
                {opt.label}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Week strip — shown in day & week modes */}
      {viewMode !== "month" && (
        <CalendarWeekStrip
          currentDate={currentDate}
          today={today}
          data={data}
          onSelectDay={selectDay}
          onPrev={() => navigate("prev")}
          onNext={() => navigate("next")}
        />
      )}

      {/* Month navigation header */}
      {viewMode === "month" && (
        <View style={s.monthNav}>
          <Pressable
            onPress={() => navigate("prev")}
            hitSlop={10}
            style={s.navBtn}
          >
            <ThemedText style={s.navArrow}>‹</ThemedText>
          </Pressable>
          <ThemedText style={s.monthNavLabel}>
            Tháng {currentDate.getMonth() + 1}, {currentDate.getFullYear()}
          </ThemedText>
          <Pressable
            onPress={() => navigate("next")}
            hitSlop={10}
            style={s.navBtn}
          >
            <ThemedText style={s.navArrow}>›</ThemedText>
          </Pressable>
        </View>
      )}

      {/* Content */}
      <View style={s.content}>
        {viewMode === "month" ? (
          <CalendarMonthView
            currentDate={currentDate}
            today={today}
            data={data}
            onSelectDay={selectDay}
          />
        ) : (
          <CalendarDayView
            date={currentDate}
            today={today}
            data={data}
            role={role}
            loading={loading}
            onPressEvent={(ev) =>
              ev.activity_id != null
                ? setSelectedActivityId(String(ev.activity_id))
                : null
            }
          />
        )}
      </View>

      {/* FAB */}
      <Pressable
        style={[s.fab, { bottom: insets.bottom + 90 }]}
        onPress={() => {}}
      >
        <ThemedText style={s.fabIcon}>+</ThemedText>
      </Pressable>

      <ActivityDetailSheet
        activityId={selectedActivityId}
        onClose={() => setSelectedActivityId(null)}
      />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f9fafb" },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  topLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  topLabel: { fontSize: 15, fontWeight: "700", color: "#111827" },
  todayBtn: {
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  todayBtnText: { fontSize: 12, fontWeight: "600", color: "#374151" },
  viewSwitcher: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
    padding: 2,
    gap: 2,
  },
  viewBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  viewBtnActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  viewBtnText: { fontSize: 12, fontWeight: "600", color: "#6b7280" },
  viewBtnTextActive: { color: OLIVE },
  monthNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  navBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  navArrow: { fontSize: 24, color: "#374151" },
  monthNavLabel: { fontSize: 15, fontWeight: "700", color: "#111827" },
  content: { flex: 1 },
  fab: {
    position: "absolute",
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: OLIVE,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  fabIcon: { fontSize: 26, color: "#fff", lineHeight: 28 },
});
