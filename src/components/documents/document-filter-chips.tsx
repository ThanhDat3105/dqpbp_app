import { ThemedText } from "@/components/themed-text";
import { DepartmentItem } from "@/services/api/document";
import { Pressable, ScrollView, StyleSheet } from "react-native";

interface Props {
  selected: number | null;
  departments: DepartmentItem[];
  onChange: (id: number | null) => void;
}

export function DocumentFilterChips({
  selected,
  departments,
  onChange,
}: Props) {
  const chips = [
    { id: null, name: "Tất cả" },
    ...departments.map((d) => ({ id: d.id, name: d.name })),
  ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={s.row}
    >
      {chips.map((chip) => {
        const active = selected === chip.id;
        return (
          <Pressable
            key={String(chip.id)}
            style={[s.chip, active && s.chipActive]}
            onPress={() => onChange(chip.id)}
          >
            <ThemedText style={[s.chipText, active && s.chipTextActive]}>
              {chip.name}
            </ThemedText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  row: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  chipActive: { backgroundColor: "#556B2F", borderColor: "#556B2F" },
  chipText: { fontSize: 13, fontWeight: "500", color: "#374151" },
  chipTextActive: { color: "#fff", fontWeight: "700" },
});
