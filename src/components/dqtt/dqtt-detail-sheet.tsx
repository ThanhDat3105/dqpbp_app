import dayjs from "dayjs";
import {
  Calendar,
  Clock,
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
  X,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import {
  getKpiSummary,
  getRecentTasks,
  KpiRecentTask,
  KpiSummary,
} from "@/services/api/kpi";
import { Users, UserStatus } from "@/services/api/user";

import { DqttKpiSection, DqttTaskList } from "./dqtt-kpi-section";

const DEPT_MAP: Record<number, string> = {
  1: "Văn thư",
  2: "Tham mưu",
  3: "Chính trị",
  4: "Hậu cần - Kỹ thuật",
  5: "Động viên - Tuyển quân",
};

const STATUS_CONFIG: Record<UserStatus, { label: string; color: string }> = {
  on_duty: { label: "Sẵn sàng chiến đấu", color: "#10b981" },
  training: { label: "Huấn luyện", color: "#3b82f6" },
  on_leave: { label: "Nghỉ phép", color: "#f59e0b" },
  other: { label: "Đã giải ngũ", color: "#9ca3af" },
};

function SectionTitle({ title }: { title: string }) {
  return <ThemedText style={s.sectionTitle}>{title}</ThemedText>;
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <View style={s.infoRow}>
      <View style={s.infoIcon}>{icon}</View>
      <View style={{ flex: 1 }}>
        <ThemedText style={s.infoLabel}>{label}</ThemedText>
        <ThemedText style={s.infoValue}>{value || "---"}</ThemedText>
      </View>
    </View>
  );
}

interface Props {
  user: Users | null;
  onClose: () => void;
}

export function DqttDetailSheet({ user, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const [kpi, setKpi] = useState<KpiSummary | null>(null);
  const [tasks, setTasks] = useState<KpiRecentTask[]>([]);
  const [kpiLoading, setKpiLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setKpi(null);
      setTasks([]);
      return;
    }
    setKpiLoading(true);
    Promise.all([
      getKpiSummary({ user_id: user.id }),
      getRecentTasks({ user_id: user.id, limit: 5 }),
    ])
      .then(([k, t]) => {
        setKpi(k);
        setTasks(t);
      })
      .catch(() => {})
      .finally(() => setKpiLoading(false));
  }, [user?.id]);

  const fmt = (iso: string | null | undefined) =>
    iso ? dayjs(iso).format("DD/MM/YYYY") : "---";
  const dept = user ? (DEPT_MAP[user.department_id] ?? "Chưa phân bổ") : "";

  return (
    <Modal
      visible={!!user}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={s.overlay}>
        <Pressable style={s.backdrop} onPress={onClose} />
        <View style={[s.sheet, { paddingBottom: insets.bottom + 12 }]}>
          <View style={s.header}>
            <ThemedText style={s.headerTitle}>Hồ sơ nhân sự</ThemedText>
            <Pressable onPress={onClose} hitSlop={8}>
              <X size={20} color="#6b7280" />
            </Pressable>
          </View>

          {user && (
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Hero */}
              <View style={s.hero}>
                {user.avatar_url ? (
                  <Image source={{ uri: user.avatar_url }} style={s.avatar} />
                ) : (
                  <View style={[s.avatar, s.avatarFallback]}>
                    <User size={36} color="#9ca3af" />
                  </View>
                )}
                <ThemedText style={s.heroName}>{user.name}</ThemedText>
                {user.military_rank && (
                  <View style={s.rankBadge}>
                    <ThemedText style={s.rankText}>
                      {user.military_rank}
                    </ThemedText>
                  </View>
                )}
              </View>

              <SectionTitle title="Thông tin cá nhân" />
              <InfoRow
                icon={<Calendar size={16} color="#9ca3af" />}
                label="Ngày sinh"
                value={fmt(user.date_of_birth)}
              />
              <InfoRow
                icon={<Phone size={16} color="#9ca3af" />}
                label="Số điện thoại"
                value={user.phone ?? ""}
              />
              <InfoRow
                icon={<Mail size={16} color="#9ca3af" />}
                label="Email"
                value={user.email ?? ""}
              />
              <InfoRow
                icon={<MapPin size={16} color="#9ca3af" />}
                label="Địa chỉ"
                value={user.address ?? ""}
              />

              <SectionTitle title="Đơn vị công tác" />
              <InfoRow
                icon={<Shield size={16} color="#9ca3af" />}
                label="Phòng ban"
                value={dept}
              />
              <InfoRow
                icon={<Clock size={16} color="#9ca3af" />}
                label="Ngày nhập ngũ"
                value={fmt(user.enlistment_date)}
              />
              <InfoRow
                icon={<Shield size={16} color="#9ca3af" />}
                label="Cấp bậc"
                value={user.military_rank ?? ""}
              />

              <SectionTitle title="Hiệu suất KPI (tháng hiện tại)" />
              <DqttKpiSection kpi={kpi} loading={kpiLoading} />

              {tasks.length > 0 && <SectionTitle title="Nhiệm vụ gần nhất" />}
              <DqttTaskList tasks={tasks} />
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "93%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: { fontSize: 17, fontWeight: "700", color: "#111827" },
  hero: { alignItems: "center", paddingVertical: 8, marginBottom: 8 },
  avatar: { width: 84, height: 84, borderRadius: 42, marginBottom: 12 },
  avatarFallback: {
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  heroName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },
  rankBadge: {
    marginTop: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: "#eff6ff",
  },
  rankText: { fontSize: 12, fontWeight: "700", color: "#1d4ed8" },
  heroStatus: { marginTop: 6, fontSize: 13, fontWeight: "600" },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f9fafb",
  },
  infoIcon: { marginTop: 2 },
  infoLabel: {
    fontSize: 11,
    color: "#9ca3af",
    fontWeight: "500",
    marginBottom: 2,
  },
  infoValue: { fontSize: 14, color: "#111827", fontWeight: "500" },
});
