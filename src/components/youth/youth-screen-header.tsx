import { ThemedText } from "@/components/themed-text";
import {
  Plus,
  Search,
  SlidersHorizontal
} from "lucide-react-native";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { FILTER_LABELS, FilterValue } from "./youth-screen-filters";

interface HeaderProps {
  total: number;
  isReadOnly: boolean;
  onAdd: () => void;
}

export function YouthScreenHeader({ total, isReadOnly, onAdd }: HeaderProps) {
  return (
    <View style={s.header}>
      <View style={s.text}>
        <ThemedText style={s.title}>Danh sách Tuổi 17</ThemedText>
        <ThemedText style={s.sub}>{total} hồ sơ</ThemedText>
      </View>
      {!isReadOnly && (
        <Pressable style={s.addBtn} onPress={onAdd}>
          <Plus size={20} color="#fff" />
        </Pressable>
      )}
    </View>
  );
}

interface ToolbarProps {
  search: string;
  onSearchChange: (v: string) => void;
  filterOpen: boolean;
  onToggleFilter: () => void;
}

export function YouthSearchToolbar({
  search,
  onSearchChange,
  filterOpen,
  onToggleFilter,
}: ToolbarProps) {
  return (
    <View style={s.toolbar}>
      <View style={s.searchWrap}>
        <Search size={16} color="#9ca3af" style={{ marginRight: 6 }} />
        <TextInput
          style={s.searchInput}
          value={search}
          onChangeText={onSearchChange}
          placeholder="Tìm theo họ tên..."
          placeholderTextColor="#9ca3af"
          returnKeyType="search"
        />
      </View>
      <Pressable
        style={[s.filterBtn, filterOpen && s.filterBtnActive]}
        onPress={onToggleFilter}
      >
        <SlidersHorizontal
          size={16}
          color={filterOpen ? "#556B2F" : "#6b7280"}
        />
      </Pressable>
    </View>
  );
}

interface ChipsProps {
  filter: FilterValue;
  onSelect: (f: FilterValue) => void;
}

export function YouthFilterChips({ filter, onSelect }: ChipsProps) {
  return (
    <View style={s.chips}>
      {(Object.keys(FILTER_LABELS) as FilterValue[]).map((f) => (
        <Pressable
          key={f}
          style={[s.chip, filter === f && s.chipActive]}
          onPress={() => onSelect(f)}
        >
          <ThemedText style={[s.chipText, filter === f && s.chipTextActive]}>
            {FILTER_LABELS[f]}
          </ThemedText>
        </Pressable>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    gap: 10,
  },
  backBtn: { padding: 4 },
  text: { flex: 1 },
  title: { fontSize: 17, fontWeight: "700", color: "#111827" },
  sub: { fontSize: 12, color: "#9ca3af", marginTop: 1 },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#3b4a2e",
    alignItems: "center",
    justifyContent: "center",
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    gap: 8,
  },
  searchWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 38,
  },
  searchInput: { flex: 1, fontSize: 14, color: "#111827", height: 38 },
  filterBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  filterBtnActive: {
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#86efac",
  },
  chips: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
  },
  chipActive: { backgroundColor: "#3b4a2e" },
  chipText: { fontSize: 13, fontWeight: "600", color: "#6b7280" },
  chipTextActive: { color: "#fff" },
});
