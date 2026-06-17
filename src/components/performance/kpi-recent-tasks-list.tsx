import dayjs from "dayjs";
import { FlatList, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { KpiRecentTask } from "@/services/api/kpi";

import { TASK_STATUS_COLORS, TASK_STATUS_LABEL } from "./performance-constants";
import { SkeletonBox } from "./performance-ui-atoms";

export function KpiRecentTasksList({
  tasks,
  loading,
  maxHeight = 300,
}: {
  tasks: KpiRecentTask[];
  loading: boolean;
  maxHeight?: number;
}) {
  return (
    <View className="mx-4 mb-3 rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <View className="px-4 pt-4 pb-3 border-b border-gray-50">
        <ThemedText style={{ fontSize: 13, fontWeight: "700", color: "#111827" }}>
          Nhiệm vụ gần đây
        </ThemedText>
      </View>

      {loading ? (
        <View className="p-4" style={{ gap: 10 }}>
          {[1, 2, 3].map((i) => (
            <SkeletonBox key={i} height={56} />
          ))}
        </View>
      ) : tasks.length === 0 ? (
        <ThemedText style={{ fontSize: 13, color: "#9ca3af", textAlign: "center", padding: 24 }}>
          Chưa có nhiệm vụ gần đây
        </ThemedText>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => String(item.id)}
          style={{ maxHeight }}
          scrollEnabled={tasks.length > 3}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: task }) => {
            const colors = TASK_STATUS_COLORS[task.status] ?? TASK_STATUS_COLORS.pending;
            return (
              <View className="flex-row items-center gap-3 px-4 py-3 border-b border-gray-50">
                <View className="flex-1">
                  <ThemedText
                    style={{ fontSize: 13, fontWeight: "600", color: "#111827" }}
                    numberOfLines={1}
                  >
                    {task.title}
                  </ThemedText>
                  <ThemedText style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>
                    {`${task.activity.name}${task.due_date ? ` · ${dayjs(task.due_date).format("DD/MM/YYYY")}` : ""}`}
                  </ThemedText>
                </View>
                <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99, backgroundColor: colors.bg }}>
                  <ThemedText style={{ fontSize: 11, fontWeight: "600", color: colors.text }}>
                    {TASK_STATUS_LABEL[task.status]}
                  </ThemedText>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}
