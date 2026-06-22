import { ThemedText } from "@/components/themed-text";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

const MILITARY_RANKS = [
  "Binh nhì",
  "Binh nhất",
  "Hạ sĩ",
  "Trung sĩ",
  "Thượng sĩ",
  "Thiếu úy",
  "Trung úy",
  "Thượng úy",
  "Đại úy",
  "Thiếu tá",
  "Trung tá",
  "Thượng tá",
  "Đại tá",
];

const RESERVE_CLASSES = [
  { value: "I" as const, label: "Hạng I" },
  { value: "II" as const, label: "Hạng II" },
];

function InlinePicker({
  value,
  placeholder,
  options,
  onChange,
}: {
  value: string;
  placeholder: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <View>
      <Pressable style={s.trigger} onPress={() => setOpen((p) => !p)}>
        <ThemedText
          style={{ color: value ? "#111827" : "#9ca3af", fontSize: 15 }}
        >
          {(options.find((o) => o.value === value)?.label ?? value) ||
            placeholder}
        </ThemedText>
      </Pressable>
      {open && (
        <View style={s.dropdown}>
          {options.map((opt) => (
            <Pressable
              key={opt.value}
              style={[s.item, value === opt.value && s.itemActive]}
              onPress={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              <ThemedText
                style={[s.itemText, value === opt.value && s.itemTextActive]}
              >
                {opt.label}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

export function MilitaryRankPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <InlinePicker
      value={value}
      placeholder="-- Chọn cấp bậc --"
      options={MILITARY_RANKS.map((r) => ({ value: r, label: r }))}
      onChange={onChange}
    />
  );
}

export function ReserveClassPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <InlinePicker
      value={value}
      placeholder="-- Chọn hạng --"
      options={RESERVE_CLASSES}
      onChange={onChange}
    />
  );
}

const s = StyleSheet.create({
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
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  itemActive: { backgroundColor: "#f0fdf4" },
  itemText: { fontSize: 15, color: "#374151" },
  itemTextActive: { color: "#16a34a", fontWeight: "600" },
});
