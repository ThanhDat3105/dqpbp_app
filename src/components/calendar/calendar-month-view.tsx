import { ThemedText } from "@/components/themed-text";
import { CalendarMetaData } from "@/services/api/calendar";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { addDays, getDateStr, isSameDay } from "./use-calendar";

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const OLIVE = "#3b4a2e";

interface Props {
  currentDate: Date;
  today: Date;
  data: CalendarMetaData;
  onSelectDay: (d: Date) => void;
}

function buildGrid(date: Date): Date[][] {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const dow = first.getDay(); // 0=Sun
  const offset = dow === 0 ? 6 : dow - 1; // Mon-based
  const gridStart = addDays(first, -offset);

  const weeks: Date[][] = [];
  let ptr = gridStart;
  for (let w = 0; w < 6; w++) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(ptr);
      ptr = addDays(ptr, 1);
    }
    weeks.push(week);
  }
  return weeks;
}

export function CalendarMonthView({
  currentDate,
  today,
  data,
  onSelectDay,
}: Props) {
  const weeks = buildGrid(currentDate);

  return (
    <ScrollView style={s.scroll}>
      {/* Weekday headers */}
      <View style={s.headerRow}>
        {WEEKDAYS.map((d, i) => (
          <View key={d} style={s.headerCell}>
            <ThemedText style={[s.headerText, i === 6 && s.sunText]}>
              {d}
            </ThemedText>
          </View>
        ))}
      </View>

      {/* Weeks */}
      {weeks.map((week, wi) => (
        <View key={wi} style={s.weekRow}>
          {week.map((day, di) => {
            const key = getDateStr(day);
            const isCurrentMonth = day.getMonth() === currentDate.getMonth();
            const isTdy = isSameDay(day, today);
            const count = data[key]?.length ?? 0;
            const isSun = di === 6;

            return (
              <Pressable
                key={key}
                onPress={() => onSelectDay(day)}
                style={s.dayCell}
              >
                <View style={[s.dayNumWrap, isTdy && s.todayWrap]}>
                  <ThemedText
                    style={[
                      s.dayNum,
                      !isCurrentMonth && s.otherMonth,
                      isSun && s.sunText,
                      isTdy && s.todayText,
                    ]}
                  >
                    {day.getDate()}
                  </ThemedText>
                </View>
                {count > 0 && (
                  <View style={s.dotsWrap}>
                    {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
                      <View key={i} style={s.dot} />
                    ))}
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      ))}
      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#fff" },
  headerRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  headerCell: { flex: 1, alignItems: "center", paddingVertical: 8 },
  headerText: { fontSize: 11, fontWeight: "700", color: "#6b7280" },
  sunText: { color: "#ef4444" },
  weekRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  dayCell: {
    flex: 1,
    minHeight: 52,
    alignItems: "center",
    paddingTop: 4,
    paddingBottom: 4,
  },
  dayNumWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  todayWrap: { backgroundColor: OLIVE },
  dayNum: { fontSize: 13, fontWeight: "600", color: "#111827" },
  otherMonth: { color: "#d1d5db" },
  todayText: { color: "#fff" },
  dotsWrap: { flexDirection: "row", gap: 2, marginTop: 2 },
  dot: { width: 5, height: 5, borderRadius: 3, backgroundColor: "#fbbf24" },
});
