import {
  CheckCircle,
  Clock,
  ListTodo,
  TrendingUp,
  X,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { Modal, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import {
  getKpiUser,
  getRecentTasks,
  KpiPeriod,
  KpiRecentTask,
  KpiUser,
} from "@/services/api/kpi";

import { KpiRecentTasksList } from "./kpi-recent-tasks-list";
import { completionColor, initials } from "./performance-helpers";
import { ProgressBar, SkeletonBox } from "./performance-ui-atoms";

const PERIODS: { value: KpiPeriod; label: string }[] = [
  { value: "week", label: "Tuần" },
  { value: "month", label: "Tháng" },
  { value: "quarter", label: "Quý" },
  { value: "year", label: "Năm" },
];

const AVATAR_COLORS = [
  { bg: "#e0e7ff", text: "#4338ca" },
  { bg: "#d1fae5", text: "#065f46" },
  { bg: "#fed7aa", text: "#c2410c" },
  { bg: "#ede9fe", text: "#6d28d9" },
  { bg: "#dbeafe", text: "#1d4ed8" },
];

function avatarColor(name: string) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

interface Props {
  user: KpiUser | null;
  onClose: () => void;
}

export function KpiUserDetailSheet({ user, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const [period, setPeriod] = useState<KpiPeriod>("month");
  const [kpiData, setKpiData] = useState<KpiUser | null>(null);
  const [tasks, setTasks] = useState<KpiRecentTask[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setKpiData(null);
    setTasks([]);
    const fetch = async () => {
      setLoading(true);
      try {
        const [kpi, recentTasks] = await Promise.all([
          getKpiUser({ user_id: user.user_id, period }),
          getRecentTasks({ user_id: user.user_id, limit: 5 }),
        ]);
        setKpiData(kpi);
        setTasks(recentTasks);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user, period]);

  const data = kpiData ?? user;
  const completionRate = data
    ? data.total_assigned > 0
      ? Math.round((data.completed / data.total_assigned) * 100)
      : 0
    : 0;

  const color = user ? avatarColor(user.name) : AVATAR_COLORS[0];

  const stats = data
    ? [
        {
          label: "Tổng NV",
          value: data.total_assigned,
          icon: ListTodo,
          bg: "#ede9fe",
          ic: "#7c3aed",
        },
        {
          label: "Hoàn thành",
          value: data.completed,
          icon: CheckCircle,
          bg: "#d1fae5",
          ic: "#059669",
        },
        {
          label: "Đúng hạn",
          value: data.on_time,
          icon: Clock,
          bg: "#dbeafe",
          ic: "#2563eb",
        },
        {
          label: "Tỷ lệ HT",
          value: `${completionRate}%`,
          icon: TrendingUp,
          bg:
            completionRate >= 70
              ? "#d1fae5"
              : completionRate >= 40
                ? "#fef3c7"
                : "#fee2e2",
          ic: completionColor(completionRate),
          valueColor: completionColor(completionRate),
        },
      ]
    : [];

  return (
    <Modal
      visible={!!user}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "flex-end",
        }}
      >
        <Pressable style={{ flex: 1 }} onPress={onClose} />

        <View
          style={{
            backgroundColor: "#fff",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: "88%",
            paddingBottom: insets.bottom + 8,
          }}
        >
          {/* Handle bar */}
          <View
            style={{ alignItems: "center", paddingTop: 10, paddingBottom: 4 }}
          >
            <View
              style={{
                width: 36,
                height: 4,
                borderRadius: 2,
                backgroundColor: "#d1d5db",
              }}
            />
          </View>

          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 20,
              paddingVertical: 12,
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: color.bg,
                alignItems: "center",
                justifyContent: "center",
                marginRight: 12,
              }}
            >
              <ThemedText
                style={{ fontSize: 14, fontWeight: "700", color: color.text }}
              >
                {user ? initials(user.name) : ""}
              </ThemedText>
            </View>

            <View style={{ flex: 1 }}>
              <ThemedText
                style={{ fontSize: 16, fontWeight: "700", color: "#111827" }}
              >
                {user?.name}
              </ThemedText>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 3,
                }}
              >
                <View
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 2,
                    borderRadius: 99,
                    backgroundColor:
                      user?.role === "DQTT" ? "#dbeafe" : "#fed7aa",
                  }}
                >
                  <ThemedText
                    style={{
                      fontSize: 11,
                      fontWeight: "600",
                      color: user?.role === "DQTT" ? "#1d4ed8" : "#c2410c",
                    }}
                  >
                    {user?.role}
                  </ThemedText>
                </View>
              </View>
            </View>

            <Pressable
              onPress={onClose}
              style={{
                padding: 8,
                borderRadius: 20,
                backgroundColor: "#f3f4f6",
              }}
            >
              <X size={18} color="#6b7280" />
            </Pressable>
          </View>

          {/* Period selector */}
          <View
            style={{
              flexDirection: "row",
              marginHorizontal: 20,
              marginBottom: 16,
              backgroundColor: "#f3f4f6",
              borderRadius: 12,
              padding: 4,
            }}
          >
            {PERIODS.map((p) => (
              <Pressable
                key={p.value}
                onPress={() => setPeriod(p.value)}
                style={{
                  flex: 1,
                  paddingVertical: 7,
                  alignItems: "center",
                  borderRadius: 9,
                  backgroundColor: period === p.value ? "#fff" : "transparent",
                  shadowColor: period === p.value ? "#000" : "transparent",
                  shadowOpacity: period === p.value ? 0.06 : 0,
                  shadowRadius: 2,
                  elevation: period === p.value ? 1 : 0,
                }}
              >
                <ThemedText
                  style={{
                    fontSize: 12,
                    fontWeight: period === p.value ? "700" : "400",
                    color: period === p.value ? "#3b4a2e" : "#6b7280",
                  }}
                >
                  {p.label}
                </ThemedText>
              </Pressable>
            ))}
          </View>

          <View>
            {/* Stat cards 2x2 */}
            {loading ? (
              <View style={{ paddingHorizontal: 20, gap: 10 }}>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <SkeletonBox height={76} style={{ flex: 1 }} />
                  <SkeletonBox height={76} style={{ flex: 1 }} />
                </View>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <SkeletonBox height={76} style={{ flex: 1 }} />
                  <SkeletonBox height={76} style={{ flex: 1 }} />
                </View>
              </View>
            ) : (
              <View style={{ paddingHorizontal: 20, gap: 10 }}>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  {stats.slice(0, 2).map((s) => (
                    <View
                      key={s.label}
                      style={{
                        flex: 1,
                        backgroundColor: "#fff",
                        borderRadius: 14,
                        borderWidth: 1,
                        borderColor: "#f3f4f6",
                        padding: 14,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: 8,
                        }}
                      >
                        <ThemedText style={{ fontSize: 11, color: "#6b7280" }}>
                          {s.label}
                        </ThemedText>
                        <View
                          style={{
                            backgroundColor: s.bg,
                            borderRadius: 8,
                            padding: 6,
                          }}
                        >
                          <s.icon size={13} color={s.ic} />
                        </View>
                      </View>
                      <ThemedText
                        style={{
                          fontSize: 22,
                          fontWeight: "700",
                          color: (s as any).valueColor ?? "#111827",
                        }}
                      >
                        {String(s.value)}
                      </ThemedText>
                    </View>
                  ))}
                </View>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  {stats.slice(2).map((s) => (
                    <View
                      key={s.label}
                      style={{
                        flex: 1,
                        backgroundColor: "#fff",
                        borderRadius: 14,
                        borderWidth: 1,
                        borderColor: "#f3f4f6",
                        padding: 14,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: 8,
                        }}
                      >
                        <ThemedText style={{ fontSize: 11, color: "#6b7280" }}>
                          {s.label}
                        </ThemedText>
                        <View
                          style={{
                            backgroundColor: s.bg,
                            borderRadius: 8,
                            padding: 6,
                          }}
                        >
                          <s.icon size={13} color={s.ic} />
                        </View>
                      </View>
                      <ThemedText
                        style={{
                          fontSize: 22,
                          fontWeight: "700",
                          color: (s as any).valueColor ?? "#111827",
                        }}
                      >
                        {String(s.value)}
                      </ThemedText>
                    </View>
                  ))}
                </View>

                {/* Completion bar */}
                {data && (
                  <View
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: "#f3f4f6",
                      padding: 14,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 8,
                      }}
                    >
                      <ThemedText
                        style={{
                          fontSize: 12,
                          color: "#374151",
                          fontWeight: "600",
                        }}
                      >
                        Tiến độ hoàn thành
                      </ThemedText>
                      <ThemedText
                        style={{
                          fontSize: 13,
                          fontWeight: "700",
                          color: completionColor(completionRate),
                        }}
                      >
                        {`${completionRate}%`}
                      </ThemedText>
                    </View>
                    <ProgressBar
                      value={completionRate}
                      color={completionColor(completionRate)}
                    />
                  </View>
                )}
              </View>
            )}

            <View style={{ marginTop: 16, marginBottom: 8 }}>
              <KpiRecentTasksList tasks={tasks} loading={loading} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
