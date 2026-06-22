import { Plus, Shield } from "lucide-react-native";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";

interface HeaderProps {
  total: number;
  isReadOnly: boolean;
  onAdd: () => void;
}

export function QndbScreenHeader({ total, isReadOnly, onAdd }: HeaderProps) {
  return (
    <View style={s.header}>
      <View style={s.titleRow}>
        <View style={s.iconWrap}>
          <Shield size={20} color="#556B2F" />
        </View>
        <View>
          <ThemedText style={s.title}>Quân nhân dự bị</ThemedText>
          <ThemedText style={s.subtitle}>{total} hồ sơ</ThemedText>
        </View>
      </View>
      {!isReadOnly && (
        <Pressable style={s.addBtn} onPress={onAdd}>
          <Plus size={18} color="#fff" />
          <ThemedText style={s.addBtnText}>Thêm mới</ThemedText>
        </Pressable>
      )}
    </View>
  );
}

interface ToolbarProps {
  search: string;
  onSearchChange: (v: string) => void;
}

export function QndbSearchToolbar({ search, onSearchChange }: ToolbarProps) {
  return (
    <View style={s.toolbar}>
      <TextInput
        style={s.searchInput}
        value={search}
        onChangeText={onSearchChange}
        placeholder="Tìm kiếm theo họ tên..."
        placeholderTextColor="#9ca3af"
        clearButtonMode="while-editing"
      />
    </View>
  );
}

const s = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 12, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconWrap: { width: 38, height: 38, borderRadius: 10, backgroundColor: "#f0f4e8", alignItems: "center", justifyContent: "center" },
  title: { fontSize: 16, fontWeight: "700", color: "#111827" },
  subtitle: { fontSize: 12, color: "#9ca3af", marginTop: 1 },
  addBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#556B2F", paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10 },
  addBtnText: { fontSize: 14, fontWeight: "600", color: "#fff" },
  toolbar: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: "#fff" },
  searchInput: { borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, color: "#111827", backgroundColor: "#fafafa" },
});
