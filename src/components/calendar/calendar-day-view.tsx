import { ThemedText } from "@/components/themed-text";
import { CalendarMetaData } from "@/services/api/calendar";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { CalendarEventCard } from "./calendar-event-card";
import {
  EventEntry,
  formatHour,
  getEventsForDay,
  groupByHour,
} from "./calendar-event-utils";

interface Props {
  date: Date;
  today: Date;
  data: CalendarMetaData;
  role: string;
  loading: boolean;
  onPressEvent?: (ev: EventEntry) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function CalendarDayView({
  date,
  today,
  data,
  role,
  loading,
  onPressEvent,
}: Props) {
  const events = getEventsForDay(date, data, role);
  const byHour = groupByHour(events);

  const [nowHour, setNowHour] = useState(new Date().getHours());
  const [nowMin, setNowMin] = useState(new Date().getMinutes());
  const scrollRef = useRef<ScrollView>(null);
  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  useEffect(() => {
    const iv = setInterval(() => {
      const now = new Date();
      setNowHour(now.getHours());
      setNowMin(now.getMinutes());
    }, 60000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const targetHour = isToday ? nowHour : 7;
    setTimeout(() => {
      scrollRef.current?.scrollTo({ y: targetHour * 56, animated: true });
    }, 100);
  }, [isToday, nowHour, date]);

  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color="#3b4a2e" />
      </View>
    );
  }

  return (
    <ScrollView
      ref={scrollRef}
      style={s.scroll}
      showsVerticalScrollIndicator={false}
    >
      {HOURS.map((hour) => {
        const hourEvents: EventEntry[] = byHour[hour] ?? [];
        const isCurrentHour = isToday && hour === nowHour;

        return (
          <View key={hour} style={s.hourRow}>
            {/* Time gutter */}
            <View style={s.gutter}>
              {hour !== 0 && (
                <ThemedText style={s.hourLabel}>{formatHour(hour)}</ThemedText>
              )}
            </View>

            {/* Content */}
            <View style={[s.content, isCurrentHour && s.contentNow]}>
              {isCurrentHour && (
                <View style={s.nowLine}>
                  <View style={s.nowDot} />
                  <View style={s.nowBar} />
                </View>
              )}
              {hourEvents.map((ev) => (
                <CalendarEventCard
                  key={String(ev.id)}
                  event={ev}
                  onPress={() => onPressEvent?.(ev)}
                />
              ))}
            </View>
          </View>
        );
      })}
      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const s = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#f9fafb" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  hourRow: {
    flexDirection: "row",
    minHeight: 56,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  gutter: {
    width: 52,
    alignItems: "flex-end",
    paddingRight: 10,
    paddingTop: 6,
    flexShrink: 0,
  },
  hourLabel: { fontSize: 11, color: "#9ca3af", fontWeight: "500" },
  content: { flex: 1, paddingHorizontal: 10, paddingVertical: 4 },
  contentNow: { backgroundColor: "#f0fdf4" },
  nowLine: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    marginLeft: -10,
  },
  nowDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ef4444",
  },
  nowBar: { flex: 1, height: 1.5, backgroundColor: "#ef4444" },
});
