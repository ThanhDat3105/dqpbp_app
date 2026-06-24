import { ThemedText } from "@/components/themed-text";
import { createWeek } from "@/services/api/schedule";
import { CalendarPlus } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TargetOption = "current" | "next" | "custom";

const OPTIONS: { value: TargetOption; label: string; desc: string }[] = [
  { value: "current", label: "Tuần hiện tại", desc: "Tạo lịch cho tuần này" },
  { value: "next", label: "Tuần sau", desc: "Tạo lịch cho tuần kế tiếp" },
  { value: "custom", label: "Chọn ngày cụ thể", desc: "Nhập ngày bất kỳ trong tuần" },
];

interface Props {
  visible: boolean;
  onClose: () => void;
  onCreated: () => void;
  onError: (msg: string) => void;
  onSuccess: (msg: string) => void;
}

export function ScheduleCreateSheet({ visible, onClose, onCreated, onError, onSuccess }: Props) {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<TargetOption>("next");
  const [customDate, setCustomDate] = useState("");
  const [saving, setSaving] = useState(false);

  const handleClose = () => {
    if (saving) return;
    setSelected("next");
    setCustomDate("");
    onClose();
  };

  const handleConfirm = async () => {
    if (selected === "custom" && !customDate) {
      onError("Vui lòng nhập ngày cụ thể (YYYY-MM-DD)");
      return;
    }
    const target = selected === "custom" ? customDate : selected;
    setSaving(true);
    try {
      const result = await createWeek(target);
      if (result.skipped > 0) {
        onSuccess(`Đã tạo ${result.created} ngày. ${result.skipped} ngày đã tồn tại.`);
      } else {
        onSuccess("Đã tạo lịch tuần thành công.");
      }
      onCreated();
      handleClose();
    } catch {
      onError("Có lỗi xảy ra khi tạo lịch.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={s.overlay}>
        <Pressable style={s.backdrop} onPress={handleClose} />
        <View style={[s.sheet, { paddingBottom: insets.bottom + 16 }]}>
          {/* Header */}
          <View style={s.header}>
            <CalendarPlus size={20} color="#2563eb" />
            <ThemedText style={s.title}>Tạo lịch trực tuần mới</ThemedText>
          </View>

          {/* Options */}
          <View style={s.optionList}>
            {OPTIONS.map((opt) => {
              const active = selected === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  style={[s.option, active && s.optionActive]}
                  onPress={() => setSelected(opt.value)}
                >
                  <View style={[s.radio, active && s.radioActive]}>
                    {active && <View style={s.radioDot} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <ThemedText style={[s.optLabel, active && s.optLabelActive]}>
                      {opt.label}
                    </ThemedText>
                    <ThemedText style={s.optDesc}>{opt.desc}</ThemedText>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Custom date input */}
          {selected === "custom" && (
            <View style={s.customWrap}>
              <ThemedText style={s.customLabel}>Ngày trong tuần cần tạo</ThemedText>
              <TextInput
                style={s.dateInput}
                value={customDate}
                onChangeText={setCustomDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9ca3af"
                keyboardType={Platform.OS === "ios" ? "numbers-and-punctuation" : "default"}
                maxLength={10}
              />
            </View>
          )}

          {/* Actions */}
          <View style={s.actions}>
            <Pressable style={s.btnCancel} onPress={handleClose} disabled={saving}>
              <ThemedText style={s.btnCancelText}>Hủy</ThemedText>
            </Pressable>
            <Pressable
              style={[s.btnConfirm, saving && s.btnDisabled]}
              onPress={handleConfirm}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <ThemedText style={s.btnConfirmText}>Tạo lịch</ThemedText>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.4)" },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  header: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 20 },
  title: { fontSize: 16, fontWeight: "700", color: "#111827" },
  optionList: { gap: 10, marginBottom: 16 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 14,
  },
  optionActive: { borderColor: "#2563eb", backgroundColor: "#eff6ff" },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#d1d5db",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  radioActive: { borderColor: "#2563eb" },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#2563eb" },
  optLabel: { fontSize: 14, fontWeight: "600", color: "#374151" },
  optLabelActive: { color: "#1d4ed8" },
  optDesc: { fontSize: 12, color: "#9ca3af", marginTop: 2 },
  customWrap: { marginBottom: 16 },
  customLabel: { fontSize: 13, fontWeight: "600", color: "#374151", marginBottom: 6 },
  dateInput: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: "#111827",
    backgroundColor: "#fafafa",
  },
  actions: { flexDirection: "row", gap: 10 },
  btnCancel: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
  },
  btnCancelText: { fontSize: 15, fontWeight: "600", color: "#374151" },
  btnConfirm: {
    flex: 2,
    backgroundColor: "#2563eb",
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
  },
  btnConfirmText: { fontSize: 15, fontWeight: "600", color: "#fff" },
  btnDisabled: { opacity: 0.6 },
});
