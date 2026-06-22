import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { Pressable, ScrollView, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { STATUS_OPTIONS } from "./activity-constants";

export function StatusFilterBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 16,
        gap: 8,
        paddingVertical: 6,
      }}
      style={{
        flexGrow: 0,
      }}
    >
      {STATUS_OPTIONS.map((opt) => (
        <Pressable
          key={opt.value}
          onPress={() => onChange(opt.value)}
          className="self-start"
          style={{
            paddingHorizontal: 14,
            paddingVertical: 6,
            borderRadius: 99,
            backgroundColor: value === opt.value ? "#3b4a2e" : "#fff",
            borderWidth: 1,
            borderColor: value === opt.value ? "#3b4a2e" : "#e5e7eb",
          }}
        >
          <ThemedText
            style={{
              fontSize: 12,
              fontWeight: "700",
              color: value === opt.value ? "#fff" : "#374151",
            }}
          >
            {opt.label}
          </ThemedText>
        </Pressable>
      ))}
    </ScrollView>
  );
}

export function MonthNav({
  date,
  onPrev,
  onNext,
  onToday,
}: {
  date: Date;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#f3f4f6",
      }}
    >
      <Pressable onPress={onPrev} style={{ padding: 6 }}>
        <ChevronLeft size={18} color="#374151" />
      </Pressable>
      <ThemedText
        style={{
          flex: 1,
          textAlign: "center",
          fontSize: 13,
          fontWeight: "700",
          color: "#111827",
        }}
      >
        {dayjs(date).format("MM/YYYY")}
      </ThemedText>
      <Pressable onPress={onNext} style={{ padding: 6 }}>
        <ChevronRight size={18} color="#374151" />
      </Pressable>
      <Pressable
        onPress={onToday}
        style={{
          backgroundColor: "#3b4a2e",
          paddingHorizontal: 10,
          paddingVertical: 5,
          borderRadius: 7,
          marginLeft: 4,
        }}
      >
        <ThemedText style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>
          Tháng này
        </ThemedText>
      </Pressable>
    </View>
  );
}
