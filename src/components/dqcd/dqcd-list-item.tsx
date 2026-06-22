import { User } from "lucide-react-native";
import { Image, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Users } from "@/services/api/user";

interface Props {
  item: Users;
  onPress: () => void;
}

export function DqcdListItem({ item, onPress }: Props) {
  return (
    <Pressable style={s.card} onPress={onPress}>
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

      <ThemedText style={s.name} numberOfLines={1}>
        {item.name}
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
});
