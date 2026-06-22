import dayjs from "dayjs";
import { Eye, Pencil, Trash2, UserCircle } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { NguonPersonnel } from "@/services/api/nguon";

interface Props {
  item: NguonPersonnel;
  isReadOnly: boolean;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function NguonListItem({ item, isReadOnly, onView, onEdit, onDelete }: Props) {
  return (
    <View style={s.card}>
      <View style={s.row}>
        <View style={s.avatar}>
          <UserCircle size={28} color="#9ca3af" />
        </View>
        <View style={s.info}>
          <ThemedText style={s.name}>{item.full_name}</ThemedText>
          <ThemedText style={s.dob}>
            {item.date_of_birth ? dayjs(item.date_of_birth).format("DD/MM/YYYY") : "---"}
          </ThemedText>
        </View>
        {item.education_level ? (
          <View style={s.badge}>
            <ThemedText style={s.badgeText}>{item.education_level}</ThemedText>
          </View>
        ) : null}
      </View>

      {(item.permanent_address || item.phone || item.note) && (
        <View style={s.meta}>
          {item.permanent_address && (
            <ThemedText style={s.metaText} numberOfLines={1}>
              {item.permanent_address}
            </ThemedText>
          )}
          {item.phone && (
            <ThemedText style={s.metaText}>{item.phone}</ThemedText>
          )}
          {item.note && (
            <ThemedText style={s.noteText} numberOfLines={2}>
              {item.note}
            </ThemedText>
          )}
        </View>
      )}

      <View style={[s.actions, { justifyContent: "space-between" }]}>
        <ActionBtn onPress={onView} color="#3b82f6" label="Xem">
          <Eye size={15} color="#3b82f6" />
        </ActionBtn>
        {!isReadOnly && (
          <>
            <ActionBtn onPress={onEdit} color="#f59e0b" label="Sửa">
              <Pencil size={15} color="#f59e0b" />
            </ActionBtn>
            <ActionBtn onPress={onDelete} color="#ef4444" label="Xóa">
              <Trash2 size={15} color="#ef4444" />
            </ActionBtn>
          </>
        )}
      </View>
    </View>
  );
}

function ActionBtn({ onPress, color, label, children }: {
  onPress: () => void; color: string; label: string; children: React.ReactNode;
}) {
  return (
    <Pressable onPress={onPress}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 4, paddingVertical: 5, paddingHorizontal: 8, borderRadius: 8, backgroundColor: "#f9fafb" }}>
        {children}
        <ThemedText style={[s.btnLabel, { color }]}>{label}</ThemedText>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 14, marginBottom: 10, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 1 }, elevation: 1 },
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#f3f4f6", alignItems: "center", justifyContent: "center" },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: "600", color: "#111827" },
  dob: { fontSize: 12, color: "#9ca3af", marginTop: 1 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, backgroundColor: "#f0fdf4" },
  badgeText: { fontSize: 11, fontWeight: "700", color: "#16a34a" },
  meta: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: "#f9fafb", gap: 3 },
  metaText: { fontSize: 12, color: "#6b7280" },
  noteText: { fontSize: 12, color: "#9ca3af", fontStyle: "italic" },
  actions: { flexDirection: "row", marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: "#f3f4f6", gap: 6 },
  btnLabel: { fontSize: 12, fontWeight: "600" },
});
