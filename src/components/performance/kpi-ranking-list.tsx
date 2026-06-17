import { Pressable, TextInput, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { KpiUser } from "@/services/api/kpi";
import { completionColor, initials } from "./performance-helpers";
import { ProgressBar, SkeletonBox } from "./performance-ui-atoms";

export function KpiRankingList({
  ranklist,
  search,
  onSearchChange,
  loading,
}: {
  ranklist: KpiUser[];
  search: string;
  onSearchChange: (v: string) => void;
  loading: boolean;
}) {
  return (
    <View className="mx-4 mb-3 rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <View className="flex-row items-center justify-between px-4 pt-4 pb-3 border-b border-gray-50">
        <ThemedText style={{ fontSize: 13, fontWeight: "700", color: "#111827" }}>
          Xếp hạng cá nhân
        </ThemedText>
        <Pressable>
          <ThemedText style={{ fontSize: 12, color: "#556B2F", fontWeight: "600" }}>
            Tất cả →
          </ThemedText>
        </Pressable>
      </View>

      <View className="px-4 py-2 border-b border-gray-50">
        <View className="flex-row items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
          <ThemedText style={{ fontSize: 12, color: "#9ca3af" }}>🔍</ThemedText>
          <TextInput
            value={search}
            onChangeText={onSearchChange}
            placeholder="Tìm theo tên..."
            placeholderTextColor="#9ca3af"
            style={{ flex: 1, fontSize: 13, color: "#111827" }}
          />
        </View>
      </View>

      {loading ? (
        <View className="p-4" style={{ gap: 10 }}>
          {[1, 2, 3].map((i) => <SkeletonBox key={i} height={44} />)}
        </View>
      ) : ranklist.length === 0 ? (
        <ThemedText style={{ fontSize: 13, color: "#9ca3af", textAlign: "center", padding: 24 }}>
          Không có dữ liệu
        </ThemedText>
      ) : (
        ranklist.map((u, idx) => (
          <View key={u.user_id} className="flex-row items-center gap-3 px-4 py-3 border-b border-gray-50">
            <ThemedText
              style={{ width: 20, fontSize: 12, fontWeight: "700", color: idx < 3 ? "#f59e0b" : "#9ca3af" }}
            >
              {idx + 1}
            </ThemedText>
            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: "#e5e7eb", alignItems: "center", justifyContent: "center" }}>
              <ThemedText style={{ fontSize: 11, fontWeight: "700", color: "#374151" }}>
                {initials(u.name)}
              </ThemedText>
            </View>
            <View className="flex-1">
              <ThemedText style={{ fontSize: 13, fontWeight: "600", color: "#111827" }}>
                {u.name}
              </ThemedText>
              <View style={{ alignSelf: "flex-start", marginTop: 2, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 99, backgroundColor: u.role === "DQTT" ? "#dbeafe" : "#fed7aa" }}>
                <ThemedText style={{ fontSize: 10, fontWeight: "600", color: u.role === "DQTT" ? "#1d4ed8" : "#c2410c" }}>
                  {u.role}
                </ThemedText>
              </View>
            </View>
            <View className="items-end" style={{ minWidth: 72 }}>
              <ThemedText style={{ fontSize: 14, fontWeight: "700", color: completionColor(u.completion_rate), marginBottom: 4 }}>
                {`${u.completion_rate.toFixed(0)}%`}
              </ThemedText>
              <ProgressBar value={u.completion_rate} color={completionColor(u.completion_rate)} />
            </View>
          </View>
        ))
      )}
    </View>
  );
}
