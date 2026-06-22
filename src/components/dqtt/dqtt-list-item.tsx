import { User } from "lucide-react-native";
import { Image, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Users } from "@/services/api/user";

const DEPT_MAP: Record<number, string> = {
  1: "Văn thư",
  2: "Tham mưu",
  3: "Chính trị",
  4: "Hậu cần - Kỹ thuật",
  5: "Động viên - Tuyển quân",
};

interface Props {
  item: Users;
  onPress: () => void;
}

export function DqttListItem({ item, onPress }: Props) {
  const dept = DEPT_MAP[item.department_id] ?? "Chưa phân bổ";

  return (
    <Pressable style={s.card} onPress={onPress}>
      {/* Avatar */}
      <View style={s.avatarWrap}>
        {item.avatar_url ? (
          <Image source={{ uri: item.avatar_url }} style={s.avatar} />
        ) : (
          <View style={[s.avatar, s.avatarFallback]}>
            <User size={28} color="#9ca3af" />
          </View>
        )}
        <View style={[s.dot, { backgroundColor: "#10b981" }]} />
      </View>

      {/* Info */}
      <ThemedText style={s.name} numberOfLines={1}>
        {item.name}
      </ThemedText>
      <ThemedText style={s.dept} numberOfLines={1}>
        {dept}
      </ThemedText>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  avatarWrap: { position: "relative", marginBottom: 12 },
  avatar: { width: 72, height: 72, borderRadius: 36 },
  avatarFallback: {
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  dot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#fff",
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },
  dept: { fontSize: 12, color: "#6b7280", marginTop: 2, textAlign: "center" },
  badges: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  rankBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: "#eff6ff",
  },
  rankText: { fontSize: 11, fontWeight: "700", color: "#1d4ed8" },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: "#f9fafb",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: 11, color: "#374151", fontWeight: "500" },
});
