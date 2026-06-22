import { ActivityIndicator, Pressable, View } from "react-native";
import { ThemedText } from "@/components/themed-text";

export function TaskActionButtons({
  status,
  canOperate,
  canUpdateProgress,
  loading,
  allReportFilled,
  onAccept,
  onComplete,
}: {
  status: string;
  canOperate: boolean;
  canUpdateProgress: boolean;
  loading: boolean;
  allReportFilled: boolean;
  onAccept: () => void;
  onComplete: () => void;
}) {
  if (!canOperate || !canUpdateProgress) return null;

  return (
    <View style={{ gap: 6 }}>
      {status === "pending" && (
        <Pressable
          onPress={onAccept}
          disabled={loading}
          style={{ backgroundColor: "#3b4a2e", borderRadius: 10, paddingVertical: 10, alignItems: "center" }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <ThemedText style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>
              Nhận nhiệm vụ
            </ThemedText>
          )}
        </Pressable>
      )}

      {status === "in_progress" && (
        <>
          <Pressable
            onPress={onComplete}
            disabled={loading || !allReportFilled}
            style={{
              backgroundColor: allReportFilled ? "#059669" : "#d1d5db",
              borderRadius: 10,
              paddingVertical: 10,
              alignItems: "center",
            }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <ThemedText style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>
                Hoàn thành nhiệm vụ
              </ThemedText>
            )}
          </Pressable>
          {!allReportFilled && (
            <ThemedText style={{ fontSize: 11, color: "#d97706", textAlign: "center" }}>
              Điền đầy đủ báo cáo để hoàn thành
            </ThemedText>
          )}
        </>
      )}
    </View>
  );
}
