import dayjs from "dayjs";
import { AlertTriangle, Download, Paperclip, Users } from "lucide-react-native";
import { useState } from "react";
import { Alert, Image, Linking, Pressable, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/context/AuthContext";
import {
  getDepartmentLabel,
  TaskInterface,
  updateReportFields,
  updateTaskStatus,
} from "@/services/api/activity";

import { ActivityStatusBadge } from "./activity-status-badge";
import { TaskActionButtons } from "./task-action-buttons";
import { TaskReportFields } from "./task-report-fields";

interface TaskCardMobileProps {
  task: TaskInterface;
  activityId: string;
  onRefresh: () => void;
}

export function TaskCardMobile({
  task,
  activityId,
  onRefresh,
}: TaskCardMobileProps) {
  const { user } = useAuth();
  const [reportFields, setReportFields] = useState(
    task.report_fields?.map((f) => ({ ...f, value: f.value ?? "" })) ?? [],
  );
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const isPrivileged = user?.role === "CHI_HUY" || user?.role === "TO_TRUONG";
  const canOperate = user?.role !== "DQCD";
  const canUpdateProgress =
    task.assignees.some((a) => String(a.id) === String(user?.id)) ||
    isPrivileged;
  const allReportFilled =
    reportFields.length === 0 ||
    reportFields.every((f) => f.value.trim() !== "");
  const isOverdue =
    dayjs().isAfter(dayjs(task.due_date), "day") && task.status !== "completed";

  const handleAccept = async () => {
    setLoading(true);
    try {
      await updateTaskStatus(task.id, "in_progress");
      onRefresh();
    } catch {
      Alert.alert("Lỗi", "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!allReportFilled) {
      Alert.alert(
        "Chưa đủ thông tin",
        "Hãy điền đầy đủ báo cáo trước khi hoàn thành",
      );
      return;
    }
    setLoading(true);
    try {
      if (reportFields.length > 0) {
        await updateReportFields(activityId, String(task.id), reportFields);
      }
      await updateTaskStatus(task.id, "completed");
      onRefresh();
    } catch {
      Alert.alert("Lỗi", "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable
      onPress={() => setExpanded((v) => !v)}
      style={{
        backgroundColor: "#fff",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#f3f4f6",
        padding: 14,
        marginBottom: 8,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 8,
        }}
      >
        <View style={{ flex: 1 }}>
          <ThemedText
            style={{ fontSize: 13, fontWeight: "600", color: "#111827" }}
            numberOfLines={expanded ? undefined : 2}
          >
            {task.title}
          </ThemedText>
        </View>
        <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
          {isOverdue && (
            <View
              style={{
                backgroundColor: "#fee2e2",
                padding: 3,
                borderRadius: 99,
              }}
            >
              <AlertTriangle size={10} color="#dc2626" />
            </View>
          )}
          <ActivityStatusBadge status={task.status} />
        </View>
      </View>

      {/* Meta */}
      <View style={{ marginTop: 8, gap: 4 }}>
        {task.team?.length > 0 && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Users size={12} color="#9ca3af" />
            <ThemedText style={{ fontSize: 11, color: "#6b7280" }}>
              {task.team.map(getDepartmentLabel).join(", ")}
            </ThemedText>
          </View>
        )}
        {task.assignees?.length > 0 && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Users size={12} color="#9ca3af" />
            <ThemedText style={{ fontSize: 11, color: "#6b7280" }}>
              {task.assignees.map((a) => a.name).join(", ")}
            </ThemedText>
          </View>
        )}
        <ThemedText style={{ fontSize: 11, color: "#6b7280" }}>
          Hạn: {dayjs(task.due_date).format("HH:mm DD/MM/YYYY")}
        </ThemedText>
      </View>

      {/* Expanded section */}
      {expanded && (
        <View
          style={{
            marginTop: 12,
            borderTopWidth: 1,
            borderTopColor: "#f3f4f6",
            paddingTop: 12,
            gap: 10,
          }}
        >
          {task.status === "in_progress" && canUpdateProgress && canOperate && (
            <TaskReportFields
              fields={reportFields}
              onChange={setReportFields}
            />
          )}
          {task.status === "completed" && (
            <TaskReportFields fields={task.report_fields ?? []} readonly />
          )}
          {task.status === "completed" &&
            (task.media_files?.length ?? 0) > 0 && (
              <View
                style={{
                  borderTopWidth: 1,
                  borderTopColor: "#f3f4f6",
                  paddingTop: 10,
                  gap: 8,
                }}
              >
                <ThemedText style={{ fontSize: 11, color: "#6b7280" }}>
                  Tệp đính kèm:
                </ThemedText>
                <View
                  style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}
                >
                  {task.media_files!.map((url, idx) => {
                    const isImage = /\.(png|jpe?g|gif|webp|svg)$/i.test(url);
                    const filename = url.split("/").pop() ?? `file-${idx + 1}`;
                    if (isImage) {
                      return (
                        <Pressable
                          key={idx}
                          onPress={() => Linking.openURL(url)}
                          style={{
                            width: 64,
                            height: 64,
                            borderRadius: 8,
                            overflow: "hidden",
                            borderWidth: 1,
                            borderColor: "#e5e7eb",
                          }}
                        >
                          <Image
                            source={{ uri: url }}
                            style={{ width: "100%", height: "100%" }}
                            resizeMode="cover"
                          />
                        </Pressable>
                      );
                    }
                    return (
                      <Pressable
                        key={idx}
                        onPress={() => Linking.openURL(url)}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 6,
                          paddingHorizontal: 10,
                          paddingVertical: 7,
                          backgroundColor: "#f9fafb",
                          borderRadius: 8,
                          borderWidth: 1,
                          borderColor: "#e5e7eb",
                          maxWidth: 180,
                        }}
                      >
                        <Paperclip size={13} color="#f59e0b" />
                        <ThemedText
                          style={{ fontSize: 11, color: "#374151", flex: 1 }}
                          numberOfLines={1}
                        >
                          {filename}
                        </ThemedText>
                        <Download size={12} color="#9ca3af" />
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}
          <TaskActionButtons
            status={task.status}
            canOperate={canOperate}
            canUpdateProgress={canUpdateProgress}
            loading={loading}
            allReportFilled={allReportFilled}
            onAccept={handleAccept}
            onComplete={handleComplete}
          />
        </View>
      )}
    </Pressable>
  );
}
