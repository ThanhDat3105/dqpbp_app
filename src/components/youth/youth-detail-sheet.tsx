import dayjs from "dayjs";
import { X } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { YouthPersonnelDetail, youthApi } from "@/services/api/youth";

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <ThemedText style={styles.rowLabel}>{label}</ThemedText>
      <ThemedText style={styles.rowValue}>{value || "---"}</ThemedText>
    </View>
  );
}

interface Props {
  id: number | null;
  onClose: () => void;
}

export function YouthDetailSheet({ id, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const [data, setData] = useState<YouthPersonnelDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      setData(null);
      return;
    }
    setLoading(true);
    youthApi
      .getById(id)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const fmt = (iso: string | null | undefined) =>
    iso ? dayjs(iso).format("DD/MM/YYYY") : "---";

  return (
    <Modal
      visible={!!id}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          {/* Header */}
          <View style={styles.sheetHeader}>
            <ThemedText style={styles.sheetTitle}>Chi tiết hồ sơ</ThemedText>
            <Pressable onPress={onClose} hitSlop={8}>
              <X size={20} color="#6b7280" />
            </Pressable>
          </View>

          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color="#556B2F" />
            </View>
          ) : data ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Status badge */}
              <View style={styles.badgeRow}>
                <View
                  style={[
                    styles.badge,
                    data.is_registered ? styles.badgeGreen : styles.badgeGray,
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.badgeText,
                      data.is_registered
                        ? styles.badgeTextGreen
                        : styles.badgeTextGray,
                    ]}
                  >
                    {data.is_registered ? "Đã làm hồ sơ" : "Chưa làm hồ sơ"}
                  </ThemedText>
                </View>
              </View>

              <DetailRow label="Họ và tên" value={data.full_name} />
              <DetailRow label="Ngày sinh" value={fmt(data.date_of_birth)} />
              <DetailRow
                label="Địa chỉ thường trú"
                value={data.permanent_address ?? ""}
              />
              <DetailRow
                label="Địa chỉ tạm trú"
                value={data.temporary_address ?? ""}
              />
              <DetailRow label="Số điện thoại" value={data.phone ?? ""} />
              <DetailRow
                label="Trình độ văn hóa"
                value={data.education_level ?? ""}
              />
              <DetailRow label="Ngày tạo" value={fmt(data.created_at)} />
              <DetailRow
                label="Cập nhật lần cuối"
                value={fmt(data.updated_at)}
              />
            </ScrollView>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    maxHeight: "80%",
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sheetTitle: { fontSize: 17, fontWeight: "700", color: "#111827" },
  center: { paddingVertical: 40, alignItems: "center" },
  badgeRow: { marginBottom: 12 },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeGreen: { backgroundColor: "#dcfce7" },
  badgeGray: { backgroundColor: "#f3f4f6" },
  badgeText: { fontSize: 13, fontWeight: "600" },
  badgeTextGreen: { color: "#15803d" },
  badgeTextGray: { color: "#6b7280" },
  row: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  rowLabel: { fontSize: 11, fontWeight: "600", color: "#9ca3af", marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.5 },
  rowValue: { fontSize: 15, color: "#1f2937" },
});
