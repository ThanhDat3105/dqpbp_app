import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";

export const EDUCATION_OPTIONS = [
  "THCS",
  "THPT",
  "Trung cấp",
  "Cao đẳng",
  "Đại học",
  "Khác",
];

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export function EducationLevelPicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <View>
      <Pressable style={styles.trigger} onPress={() => setOpen((p) => !p)}>
        <ThemedText style={{ color: value ? "#111827" : "#9ca3af", fontSize: 15 }}>
          {value || "-- Chọn trình độ --"}
        </ThemedText>
      </Pressable>
      {open && (
        <View style={styles.dropdown}>
          {EDUCATION_OPTIONS.map((opt) => (
            <Pressable
              key={opt}
              style={[styles.item, value === opt && styles.itemActive]}
              onPress={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              <ThemedText
                style={[styles.itemText, value === opt && styles.itemTextActive]}
              >
                {opt}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    backgroundColor: "#fafafa",
    justifyContent: "center",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    marginTop: 4,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  item: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  itemActive: { backgroundColor: "#f0fdf4" },
  itemText: { fontSize: 15, color: "#374151" },
  itemTextActive: { color: "#16a34a", fontWeight: "600" },
});
