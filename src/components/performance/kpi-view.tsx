import { CheckCircle, Clock, ListTodo, TrendingUp } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import { Alert, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/context/AuthContext";
import {
  DeptKpiItem,
  getDeptKpiList,
  getKpiList,
  getKpiSummary,
  getRecentTasks,
  KpiPeriod,
  KpiRecentTask,
  KpiSummary,
  KpiUser,
} from "@/services/api/kpi";

import { KpiDeptCompletionList } from "./kpi-dept-completion-list";
import { KpiRankingList } from "./kpi-ranking-list";
import { KpiRecentTasksList } from "./kpi-recent-tasks-list";
import { completionColor } from "./performance-helpers";
import { PeriodSelector, SkeletonBox, StatCard } from "./performance-ui-atoms";

export function KpiView() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const [period, setPeriod] = useState<KpiPeriod>("month");
  const [summary, setSummary] = useState<KpiSummary | null>(null);
  const [deptList, setDeptList] = useState<DeptKpiItem[]>([]);
  const [ranklist, setRanklist] = useState<KpiUser[]>([]);
  const [tasks, setTasks] = useState<KpiRecentTask[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [sum, dept, rank, recentTasks] = await Promise.all([
          getKpiSummary({ period, user_id: user.id }),
          getDeptKpiList({ period }),
          getKpiList({ period }),
          getRecentTasks({ user_id: user.id, limit: 5 }),
        ]);
        setSummary(sum);
        setDeptList(dept);
        setRanklist(rank);
        setTasks(recentTasks);
      } catch {
        Alert.alert("Lỗi", "Không thể tải dữ liệu KPI");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [user, period]);

  const filteredRank = useMemo(
    () =>
      ranklist.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [ranklist, search],
  );

  const completionRate = summary
    ? summary.total_assigned > 0
      ? Math.round((summary.completed / summary.total_assigned) * 100)
      : 0
    : 0;

  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-4 pt-4 pb-2">
        <ThemedText
          style={{ fontSize: 18, fontWeight: "700", color: "#111827" }}
        >
          Hiệu suất làm việc
        </ThemedText>
        <ThemedText style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
          Theo dõi hiệu suất DQTT / DQCD
        </ThemedText>
      </View>

      <View className="px-4 pb-3">
        <PeriodSelector value={period} onChange={setPeriod} />
      </View>

      {loading ? (
        <>
          <View className="flex-row gap-3 px-4 mb-3">
            <SkeletonBox height={80} style={{ flex: 1 }} />
            <SkeletonBox height={80} style={{ flex: 1 }} />
          </View>
          <View className="flex-row gap-3 px-4 mb-3">
            <SkeletonBox height={80} style={{ flex: 1 }} />
            <SkeletonBox height={80} style={{ flex: 1 }} />
          </View>
        </>
      ) : (
        <>
          <View className="flex-row gap-3 px-4 mb-3">
            <StatCard
              label="Tổng nhiệm vụ"
              value={summary?.total_assigned ?? 0}
              icon={ListTodo}
              iconBg="#ede9fe"
              iconColor="#7c3aed"
            />
            <StatCard
              label="Hoàn thành"
              value={summary?.completed ?? 0}
              icon={CheckCircle}
              iconBg="#d1fae5"
              iconColor="#059669"
            />
          </View>
          <View className="flex-row gap-3 px-4 mb-3">
            <StatCard
              label="Đúng hạn"
              value={summary?.completed_on_time ?? 0}
              icon={Clock}
              iconBg="#dbeafe"
              iconColor="#2563eb"
            />
            <StatCard
              label="Tỷ lệ hoàn thành"
              value={`${completionRate}%`}
              icon={TrendingUp}
              iconBg={
                completionRate >= 70
                  ? "#d1fae5"
                  : completionRate >= 40
                    ? "#fef3c7"
                    : "#fee2e2"
              }
              iconColor={completionColor(completionRate)}
              valueColor={completionColor(completionRate)}
            />
          </View>
        </>
      )}

      <KpiDeptCompletionList
        deptList={deptList}
        period={period}
        loading={loading}
      />
      <KpiRankingList
        ranklist={filteredRank}
        search={search}
        onSearchChange={setSearch}
        loading={loading}
      />
      <KpiRecentTasksList tasks={tasks} loading={loading} />
    </View>
  );
}
