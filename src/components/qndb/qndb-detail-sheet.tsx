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
import { QndbPersonnelDetail, qndbApi } from "@/services/api/qndb";

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.row}>
      <ThemedText style={s.rowLabel}>{label}</ThemedText>
      <ThemedText style={s.rowValue}>{value || "---"}</ThemedText>
    </View>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <View style={s.sectionTitle}>
      <ThemedText style={s.sectionTitleText}>{title}</ThemedText>
    </View>
  );
}

interface Props {
  id: number | null;
  onClose: () => void;
}

export function QndbDetailSheet({ id, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const [data, setData] = useState<QndbPersonnelDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) { setData(null); return; }
    setLoading(true);
    qndbApi.getById(id).then(setData).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const fmt = (iso: string | null | undefined) =>
    iso ? dayjs(iso).format("DD/MM/YYYY") : "---";

  return (
    <Modal visible={!!id} animationType="slide" transparent onRequestClose={onClose}>
      <View style={s.overlay}>
        <Pressable style={s.backdrop} onPress={onClose} />
        <View style={[s.sheet, { paddingBottom: insets.bottom + 16 }]}>
          <View style={s.header}>
            <ThemedText style={s.title}>Chi tiết quân nhân dự bị</ThemedText>
            <Pressable onPress={onClose} hitSlop={8}>
              <X size={20} color="#6b7280" />
            </Pressable>
          </View>

          {loading ? (
            <View style={s.center}><ActivityIndicator size="large" color="#556B2F" /></View>
          ) : data ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <SectionTitle title="Thông tin cá nhân" />
              <DetailRow label="Họ và tên" value={data.full_name} />
              <DetailRow label="Ngày sinh" value={fmt(data.date_of_birth)} />
              <DetailRow label="Số điện thoại" value={data.phone ?? ""} />
              <DetailRow label="Địa chỉ thường trú" value={data.permanent_address ?? ""} />
              <DetailRow label="Địa chỉ tạm trú" value={data.temporary_address ?? ""} />
              <DetailRow label="Trình độ văn hóa" value={data.education_level ?? ""} />

              <SectionTitle title="Thông tin quân sự" />
              <DetailRow label="Cấp bậc quân hàm" value={data.military_rank ?? ""} />
              <DetailRow label="Đơn vị" value={data.unit ?? ""} />
              <DetailRow label="Ngày nhập ngũ" value={fmt(data.service_start_date)} />
              <DetailRow label="Ngày xuất ngũ" value={fmt(data.service_end_date)} />
              <DetailRow
                label="Hạng dự bị"
                value={data.reserve_class ? `Hạng ${data.reserve_class}` : ""}
              />
              <DetailRow label="Ghi chú" value={data.note ?? ""} />
              <DetailRow label="Ngày tạo" value={fmt(data.created_at)} />
              <DetailRow label="Cập nhật lần cuối" value={fmt(data.updated_at)} />
            </ScrollView>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.4)" },
  sheet: { backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: "85%" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  title: { fontSize: 17, fontWeight: "700", color: "#111827" },
  center: { paddingVertical: 40, alignItems: "center" },
  sectionTitle: { paddingVertical: 8, marginTop: 4 },
  sectionTitleText: { fontSize: 11, fontWeight: "700", color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.8 },
  row: { paddingVertical: 11, borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },
  rowLabel: { fontSize: 11, fontWeight: "600", color: "#9ca3af", marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.5 },
  rowValue: { fontSize: 15, color: "#1f2937" },
});
