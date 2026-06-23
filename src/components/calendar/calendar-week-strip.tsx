import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { CalendarMetaData } from "@/services/api/calendar";
import { addDays, getDateStr, isSameDay, startOfWeek } from "./use-calendar";

const DAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

interface Props {
  currentDate: Date;
  today: Date;
  data: CalendarMetaData;
  onSelectDay: (d: Date) => void;
  onPrev: () => void;
  onNext: () => void;
}

function getEventCount(date: Date, data: CalendarMetaData): number {
  const key = getDateStr(date);
  const dayData = data[key];
  if (!dayData) return 0;
  return dayData.length;
}

export function CalendarWeekStrip({
  currentDate,
  today,
  data,
  onSelectDay,
  onPrev,
  onNext,
}: Props) {
  const weekStart = startOfWeek(currentDate);
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const weekLabel = (() => {
    const end = addDays(weekStart, 6);
    const d1 = weekStart.getDate();
    const d2 = end.getDate();
    const m = weekStart.getMonth() + 1;
    const y = weekStart.getFullYear();
    return `Tuần ${d1} - ${d2}/${m < 10 ? "0" + m : m}/${y}`;
  })();

  const monthLabel = `Tháng ${currentDate.getMonth() + 1}, ${currentDate.getFullYear()}`;

  return (
    <View style={s.container}>
      {/* Month row + nav */}
      <View style={s.monthRow}>
        <Pressable onPress={onPrev} hitSlop={10} style={s.navBtn}>
          <ThemedText style={s.navArrow}>{"‹"}</ThemedText>
        </Pressable>
        <View style={s.monthCenter}>
          <ThemedText style={s.monthText}>{monthLabel}</ThemedText>
          <ThemedText style={s.weekText}>{weekLabel}</ThemedText>
        </View>
        <Pressable onPress={onNext} hitSlop={10} style={s.navBtn}>
          <ThemedText style={s.navArrow}>{"›"}</ThemedText>
        </Pressable>
      </View>

      {/* Day strip */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.strip}
      >
        {days.map((day, i) => {
          const isSelected = isSameDay(day, currentDate);
          const isToday = isSameDay(day, today);
          const count = getEventCount(day, data);
          const isSun = i === 6;

          return (
            <Pressable
              key={getDateStr(day)}
              onPress={() => onSelectDay(day)}
              style={[s.dayCell, isSelected && s.dayCellActive]}
            >
              <ThemedText
                style={[
                  s.dayLabel,
                  isSun && s.sunLabel,
                  isSelected && s.dayLabelActive,
                ]}
              >
                {DAY_LABELS[i]}
              </ThemedText>
              <View
                style={[
                  s.dayNumWrap,
                  isToday && s.todayWrap,
                  isSelected && !isToday && s.selectedWrap,
                ]}
              >
                <ThemedText
                  style={[
                    s.dayNum,
                    isSun && s.sunNum,
                    (isToday || isSelected) && s.dayNumActive,
                  ]}
                >
                  {day.getDate()}
                </ThemedText>
              </View>
              {count > 0 && (
                <View style={s.countBadge}>
                  <ThemedText style={s.countText}>
                    +{count > 9 ? "9" : count}
                  </ThemedText>
                </View>
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const OLIVE = "#3b4a2e";
const OLIVE_LIGHT = "#e8edd4";

const s = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 8,
  },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 6,
  },
  navBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  navArrow: { fontSize: 24, color: "#374151", lineHeight: 28 },
  monthCenter: { alignItems: "center", flex: 1 },
  monthText: { fontSize: 16, fontWeight: "700", color: "#111827" },
  weekText: { fontSize: 11, color: "#9ca3af", marginTop: 1 },
  strip: { paddingHorizontal: 8, gap: 4 },
  dayCell: {
    alignItems: "center",
    width: 44,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dayCellActive: { backgroundColor: OLIVE_LIGHT },
  dayLabel: { fontSize: 11, fontWeight: "600", color: "#6b7280", marginBottom: 4 },
  dayLabelActive: { color: OLIVE },
  sunLabel: { color: "#ef4444" },
  sunNum: { color: "#ef4444" },
  dayNumWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  todayWrap: { backgroundColor: OLIVE },
  selectedWrap: { backgroundColor: OLIVE_LIGHT, borderWidth: 1.5, borderColor: OLIVE },
  dayNum: { fontSize: 14, fontWeight: "700", color: "#111827" },
  dayNumActive: { color: "#fff" },
  countBadge: {
    marginTop: 3,
    backgroundColor: "#fbbf24",
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: "center",
  },
  countText: { fontSize: 9, fontWeight: "700", color: "#92400e" },
});
