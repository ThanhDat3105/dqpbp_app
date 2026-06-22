import dayjs from "dayjs";
import {
  ChevronLeft,
  Download,
  MapPin,
  Paperclip,
  Users,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import {
  ActivityInterface,
  getActivityDetail,
  getDepartmentLabel,
  getWorkTypeLabel,
} from "@/services/api/activity";

import { ActivityStatusBadge } from "./activity-status-badge";
import { TaskCardMobile } from "./task-card-mobile";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <ThemedText style={{ fontSize: 11, color: "#6b7280", marginBottom: 2 }}>
        {label}
      </ThemedText>
      <ThemedText style={{ fontSize: 13, fontWeight: "600", color: "#111827" }}>
        {value || "—"}
      </ThemedText>
    </View>
  );
}

function ProgressSection({ tasks }: { tasks: ActivityInterface["tasks"] }) {
  const done = tasks.filter((t) => t.status === "completed").length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  return (
    <View style={{ marginTop: 4 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <ThemedText
          style={{ fontSize: 12, fontWeight: "700", color: "#374151" }}
        >
          Tiến độ thực hiện
        </ThemedText>
        <ThemedText
          style={{
            fontSize: 12,
            fontWeight: "700",
            color: pct === 100 ? "#059669" : "#556B2F",
          }}
        >
          {pct}%
        </ThemedText>
      </View>
      <View
        style={{
          height: 6,
          backgroundColor: "#e5e7eb",
          borderRadius: 99,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: `${pct}%`,
            height: "100%",
            backgroundColor: pct === 100 ? "#10b981" : "#556B2F",
            borderRadius: 99,
          }}
        />
      </View>
      <ThemedText style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>
        {done} / {tasks.length} nhiệm vụ đã hoàn thành
      </ThemedText>
    </View>
  );
}

export function ActivityDetailScreen({
  activityId,
  onBack,
}: {
  activityId: string;
  onBack: () => void;
}) {
  const insets = useSafeAreaInsets();
  const [activity, setActivity] = useState<ActivityInterface | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = async () => {
    try {
      const data = await getActivityDetail(activityId);
      setActivity(data);
    } catch {
      // keep null
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [activityId]);

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: "#3b4a2e",
          paddingTop: insets.top + 10,
          paddingBottom: 14,
          paddingHorizontal: 16,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Pressable onPress={onBack} style={{ marginRight: 12 }}>
          <ChevronLeft size={24} color="#fff" />
        </Pressable>
        <ThemedText
          style={{ flex: 1, color: "#fff", fontSize: 16, fontWeight: "700" }}
          numberOfLines={1}
        >
          Chi tiết công tác
        </ThemedText>
      </View>

      {loading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color="#556B2F" />
        </View>
      ) : !activity ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ThemedText style={{ color: "#9ca3af" }}>
            Không tìm thấy dữ liệu
          </ThemedText>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            padding: 16,
            paddingBottom: insets.bottom + 32,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Title & badges */}
          <ThemedText
            style={{
              fontSize: 17,
              fontWeight: "700",
              color: "#111827",
              marginBottom: 8,
            }}
          >
            {activity.name}
          </ThemedText>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 6,
              marginBottom: 16,
            }}
          >
            <ActivityStatusBadge status={activity.status} />
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 3,
                backgroundColor: "#dbeafe",
                borderRadius: 99,
              }}
            >
              <ThemedText
                style={{ fontSize: 11, fontWeight: "700", color: "#1e40af" }}
              >
                {getWorkTypeLabel(activity.work_type)}
              </ThemedText>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                paddingHorizontal: 8,
                paddingVertical: 3,
                backgroundColor: "#fed7aa",
                borderRadius: 99,
              }}
            >
              <Users size={10} color="#c2410c" />
              <ThemedText
                style={{ fontSize: 11, fontWeight: "700", color: "#c2410c" }}
              >
                {getDepartmentLabel(activity.department)}
              </ThemedText>
            </View>
            {activity.location && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  backgroundColor: "#ede9fe",
                  borderRadius: 99,
                }}
              >
                <MapPin size={10} color="#7c3aed" />
                <ThemedText
                  style={{ fontSize: 11, fontWeight: "700", color: "#7c3aed" }}
                >
                  {activity.location}
                </ThemedText>
              </View>
            )}
          </View>

          {/* Info card */}
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#f3f4f6",
              padding: 16,
              marginBottom: 12,
            }}
          >
            <ThemedText
              style={{
                fontSize: 13,
                fontWeight: "700",
                color: "#111827",
                marginBottom: 12,
              }}
            >
              Thông tin chi tiết
            </ThemedText>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1 }}>
                <InfoRow
                  label="Loại công việc"
                  value={getWorkTypeLabel(activity.work_type)}
                />
                <InfoRow
                  label="Tổ công tác"
                  value={getDepartmentLabel(activity.department)}
                />
                <InfoRow label="Số công văn" value={activity.document_number} />
              </View>
              <View style={{ flex: 1 }}>
                <InfoRow
                  label="Ngày bắt đầu"
                  value={dayjs(activity.start_date).format("DD/MM/YYYY")}
                />
                <InfoRow
                  label="Ngày kết thúc"
                  value={dayjs(activity.end_date).format("DD/MM/YYYY")}
                />
                <InfoRow label="Địa điểm" value={activity.location} />
              </View>
            </View>

            {activity.tasks.length > 0 && (
              <View
                style={{
                  borderTopWidth: 1,
                  borderTopColor: "#f3f4f6",
                  paddingTop: 12,
                  marginTop: 4,
                }}
              >
                <ProgressSection tasks={activity.tasks} />
              </View>
            )}

            {activity.attached_files?.length > 0 && (
              <View
                style={{
                  borderTopWidth: 1,
                  borderTopColor: "#f3f4f6",
                  paddingTop: 12,
                  marginTop: 12,
                  gap: 6,
                }}
              >
                <ThemedText
                  style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}
                >
                  File đính kèm
                </ThemedText>
                {activity.attached_files.map((url, idx) => {
                  const filename = decodeURIComponent(
                    url.split("/").pop() ?? `file-${idx + 1}`,
                  );
                  return (
                    <Pressable
                      key={idx}
                      onPress={() => Linking.openURL(url)}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                        padding: 10,
                        backgroundColor: "#f9fafb",
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: "#e5e7eb",
                      }}
                    >
                      <Paperclip size={14} color="#9ca3af" />
                      <ThemedText
                        style={{ flex: 1, fontSize: 12, color: "#374151" }}
                        numberOfLines={1}
                      >
                        {filename}
                      </ThemedText>
                      <Download size={14} color="#6b7280" />
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>

          {/* Tasks */}
          {activity.tasks.length > 0 && (
            <View>
              <ThemedText
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  color: "#111827",
                  marginBottom: 10,
                }}
              >
                Nhiệm vụ ({activity.tasks.length})
              </ThemedText>
              {activity.tasks.map((task) => (
                <TaskCardMobile
                  key={task.id}
                  task={task}
                  activityId={activity.id}
                  onRefresh={fetchDetail}
                />
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}
