import { AlertTriangle, BarChart3, Shield, Users } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import {
  DeptItem,
  getPersonnelByDept,
  getPersonnelList,
  getPersonnelOverview,
  getPersonnelStatusBreakdown,
  PersonnelItem,
  PersonnelOverview,
  StatusItem,
} from "@/services/api/personnel";

import { ForcePersonnelList } from "./force-personnel-list";
import { ProgressBar, SkeletonBox, StatCard } from "./performance-ui-atoms";

export function ForceView() {
  const [overview, setOverview] = useState<PersonnelOverview | null>(null);
  const [byDept, setByDept] = useState<DeptItem[]>([]);
  const [statusBreakdown, setStatusBreakdown] = useState<{
    total: number;
    breakdown: StatusItem[];
  } | null>(null);
  const [personnelList, setPersonnelList] = useState<PersonnelItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [ov, dept, status, list] = await Promise.all([
          getPersonnelOverview(),
          getPersonnelByDept(),
          getPersonnelStatusBreakdown(),
          getPersonnelList({ status: "on_duty", limit: 10, role: "DQTT" }),
        ]);
        setOverview(ov);
        setByDept(dept);
        setStatusBreakdown(status);
        setPersonnelList(list);
      } catch {
        Alert.alert("Lỗi", "Không thể tải dữ liệu nhân sự");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const OVERVIEW_CARDS = overview
    ? [
        {
          label: "Tổng số dân quân",
          value: String(overview.total_users),
          icon: Users,
          iconBg: "#ede9fe",
          iconColor: "#7c3aed",
        },
        {
          label: "Tổng số Tổ",
          value: String(overview.total_departments),
          icon: BarChart3,
          iconBg: "#dbeafe",
          iconColor: "#2563eb",
        },
        {
          label: "Cảnh báo",
          value: String(overview.alerts),
          icon: AlertTriangle,
          iconBg: "#fee2e2",
          iconColor: "#dc2626",
        },
        {
          label: "Sẵn sàng chiến đấu",
          value: `${overview.readiness_percent}%`,
          icon: Shield,
          iconBg: "#d1fae5",
          iconColor: "#059669",
          valueColor: overview.readiness_percent >= 70 ? "#059669" : "#f59e0b",
        },
      ]
    : [];

  return (
    <View className="flex-1 bg-gray-50">
      <View className="px-4 pt-4 pb-3">
        <ThemedText
          style={{ fontSize: 18, fontWeight: "700", color: "#111827" }}
        >
          Dashboard Nhân sự
        </ThemedText>
        <ThemedText style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
          Thống kê tổng quan tình trạng lực lượng
        </ThemedText>
      </View>

      {/* Overview 2x2 */}
      {loading ? (
        <>
          <View className="flex-row gap-3 px-4 mb-3">
            <SkeletonBox height={84} style={{ flex: 1 }} />{" "}
            <SkeletonBox height={84} style={{ flex: 1 }} />
          </View>
          <View className="flex-row gap-3 px-4 mb-3">
            <SkeletonBox height={84} style={{ flex: 1 }} />{" "}
            <SkeletonBox height={84} style={{ flex: 1 }} />
          </View>
        </>
      ) : (
        <>
          <View className="flex-row gap-3 px-4 mb-3">
            {OVERVIEW_CARDS.slice(0, 2).map((c) => (
              <StatCard key={c.label} {...c} />
            ))}
          </View>
          <View className="flex-row gap-3 px-4 mb-3">
            {OVERVIEW_CARDS.slice(2).map((c) => (
              <StatCard key={c.label} {...c} />
            ))}
          </View>
        </>
      )}

      {/* Phân bổ theo Tổ */}
      <View className="mx-4 mb-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <ThemedText
          style={{
            fontSize: 13,
            fontWeight: "700",
            color: "#111827",
            marginBottom: 2,
          }}
        >
          Phân bổ nhân sự theo Tổ
        </ThemedText>
        <ThemedText
          style={{ fontSize: 11, color: "#6b7280", marginBottom: 12 }}
        >
          Tổng số thành viên trong mỗi tổ
        </ThemedText>

        {loading ? (
          <View style={{ gap: 12 }}>
            {[1, 2, 3, 4].map((i) => (
              <SkeletonBox key={i} height={24} />
            ))}
          </View>
        ) : byDept.length === 0 ? (
          <ThemedText
            style={{
              fontSize: 12,
              color: "#9ca3af",
              textAlign: "center",
              paddingVertical: 16,
            }}
          >
            Không có dữ liệu
          </ThemedText>
        ) : (
          <View style={{ gap: 10 }}>
            {byDept.map((dept) => (
              <View key={dept.department_id}>
                <View className="flex-row items-center justify-between mb-1.5">
                  <ThemedText style={{ fontSize: 12, color: "#374151" }}>
                    {dept.department_name}
                  </ThemedText>
                  <ThemedText
                    style={{
                      fontSize: 12,
                      fontWeight: "700",
                      color: "#3b4a2e",
                    }}
                  >
                    {`${dept.total} người`}
                  </ThemedText>
                </View>
                <ProgressBar
                  value={(dept.total / (overview?.total_users ?? 1)) * 100}
                  color="#6B8E23"
                />
              </View>
            ))}
          </View>
        )}
      </View>

      <ForcePersonnelList list={personnelList} loading={loading} />
    </View>
  );
}
