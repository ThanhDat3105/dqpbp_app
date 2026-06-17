import { View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { DeptKpiItem } from "@/services/api/kpi";
import { PERIOD_LABELS } from "./performance-constants";
import { completionColor } from "./performance-helpers";
import { ProgressBar, SkeletonBox } from "./performance-ui-atoms";
import { KpiPeriod } from "@/services/api/kpi";

export function KpiDeptCompletionList({
  deptList,
  period,
  loading,
}: {
  deptList: DeptKpiItem[];
  period: KpiPeriod;
  loading: boolean;
}) {
  return (
    <View className="mx-4 mb-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <ThemedText style={{ fontSize: 13, fontWeight: "700", color: "#111827", marginBottom: 2 }}>
        Tỷ lệ hoàn thành theo Tổ
      </ThemedText>
      <ThemedText style={{ fontSize: 11, color: "#6b7280", marginBottom: 12 }}>
        {`Trong ${PERIOD_LABELS[period].toLowerCase()} này`}
      </ThemedText>

      {loading ? (
        <View style={{ gap: 12 }}>
          {[1, 2, 3, 4].map((i) => <SkeletonBox key={i} height={20} />)}
        </View>
      ) : deptList.length === 0 ? (
        <ThemedText style={{ fontSize: 12, color: "#9ca3af", textAlign: "center", paddingVertical: 16 }}>
          Chưa có dữ liệu
        </ThemedText>
      ) : (
        <View style={{ gap: 12 }}>
          {deptList.map((dept) => (
            <View key={dept.department_id}>
              <View className="flex-row items-center justify-between mb-1.5">
                <ThemedText style={{ fontSize: 12, color: "#374151" }}>
                  {dept.department_name}
                </ThemedText>
                <ThemedText style={{ fontSize: 12, fontWeight: "700", color: completionColor(dept.completion_rate) }}>
                  {`${dept.completion_rate.toFixed(0)}%`}
                </ThemedText>
              </View>
              <ProgressBar value={dept.completion_rate} color={completionColor(dept.completion_rate)} />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
