import { Plus, Search } from "lucide-react-native";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";

interface HeaderProps {
  total: number;
  isReadOnly: boolean;
  onAdd: () => void;
}

export function NguonScreenHeader({ total, isReadOnly, onAdd }: HeaderProps) {
  return (
    <View style={s.header}>
      <View style={s.text}>
        <ThemedText style={s.title}>Danh sách Nguồn</ThemedText>
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
}

export function NguonSearchToolbar({ search, onSearchChange }: ToolbarProps) {
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
});
