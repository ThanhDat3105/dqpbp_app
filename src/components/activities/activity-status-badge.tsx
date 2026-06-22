import { View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { STATUS_CONFIG } from "./activity-constants";

export function ActivityStatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 99,
        backgroundColor: cfg.bg,
      }}
    >
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: cfg.dot }} />
      <ThemedText style={{ fontSize: 11, fontWeight: "700", color: cfg.text }}>
        {cfg.label}
      </ThemedText>
    </View>
  );
}
