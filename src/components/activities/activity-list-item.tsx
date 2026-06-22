import dayjs from "dayjs";
import { CalendarDays } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ActivityInterface, getDepartmentLabel, getWorkTypeLabel } from "@/services/api/activity";

import { ActivityStatusBadge } from "./activity-status-badge";
import { calcProgress, getDeadlineDisplay } from "./activity-helpers";

export function ActivityListItem({
  activity,
  onPress,
}: {
  activity: ActivityInterface;
  onPress: () => void;
}) {
  const progress = calcProgress(activity.tasks);
  const deadline = getDeadlineDisplay(activity.end_date, activity.completed_at);

  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: "#fff",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#f3f4f6",
        padding: 14,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <ActivityStatusBadge status={activity.status} />
        <ThemedText style={{ fontSize: 11, color: "#6b7280", fontWeight: "600" }}>
          {getDepartmentLabel(activity.department)}
        </ThemedText>
      </View>

      <ThemedText style={{ fontSize: 14, fontWeight: "700", color: "#111827", marginBottom: 4 }} numberOfLines={2}>
        {activity.name}
      </ThemedText>

      <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
        <View style={{ paddingHorizontal: 7, paddingVertical: 2, backgroundColor: "#dbeafe", borderRadius: 99 }}>
          <ThemedText style={{ fontSize: 11, fontWeight: "600", color: "#1e40af" }}>
            {getWorkTypeLabel(activity.work_type)}
          </ThemedText>
        </View>
        <View style={{ paddingHorizontal: 7, paddingVertical: 2, backgroundColor: "#f3f4f6", borderRadius: 99 }}>
          <ThemedText style={{ fontSize: 11, fontWeight: "600", color: "#374151" }}>
            {activity.tasks.length} nhiệm vụ
          </ThemedText>
        </View>
      </View>

      {activity.tasks.length > 0 && (
        <View style={{ marginBottom: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <View style={{ flex: 1, height: 5, backgroundColor: "#e5e7eb", borderRadius: 99, overflow: "hidden" }}>
              <View style={{ width: `${progress}%`, height: "100%", backgroundColor: progress === 100 ? "#10b981" : "#556B2F", borderRadius: 99 }} />
            </View>
            <ThemedText style={{ fontSize: 11, fontWeight: "700", color: "#6b7280", minWidth: 32 }}>
              {progress}%
            </ThemedText>
          </View>
        </View>
      )}

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <CalendarDays size={12} color="#9ca3af" />
          <ThemedText style={{ fontSize: 11, color: "#9ca3af" }}>
            Hạn: {dayjs(activity.end_date).format("DD/MM/YYYY")}
          </ThemedText>
        </View>
        <ThemedText style={{ fontSize: 11, fontWeight: "700", color: deadline.color }}>
          {deadline.text}
        </ThemedText>
      </View>
    </Pressable>
  );
}
