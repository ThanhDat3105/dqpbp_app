import { X } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { EducationLevelPicker } from "@/components/youth/education-level-picker";
import { YouthFormField, inputStyle } from "@/components/youth/youth-form-field";
import { NguonCreatePayload, NguonPersonnelDetail } from "@/services/api/nguon";

import { submitNguonForm, validateNguonForm } from "./nguon-form-submit-handler";

const EMPTY: NguonCreatePayload = {
  full_name: "", date_of_birth: "", permanent_address: "",
  temporary_address: "", phone: "", education_level: "", note: "",
};

interface Props {
  visible: boolean;
  mode: "create" | "edit";
  initial?: NguonPersonnelDetail | null;
  onClose: () => void;
  onSuccess: () => void;
  onError: (msg: string) => void;
}

export function NguonFormModal({ visible, mode, initial, onClose, onSuccess, onError }: Props) {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState<NguonCreatePayload>(EMPTY);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setForm(mode === "edit" && initial ? {
      full_name: initial.full_name,
      date_of_birth: initial.date_of_birth?.split("T")[0] ?? "",
      permanent_address: initial.permanent_address ?? "",
      temporary_address: initial.temporary_address ?? "",
      phone: initial.phone ?? "",
      education_level: initial.education_level ?? "",
      note: initial.note ?? "",
    } : EMPTY);
  }, [visible, mode, initial]);

  const set = (key: keyof NguonCreatePayload) => (v: string) =>
    setForm((p) => ({ ...p, [key]: v }));

  const handleSubmit = async () => {
    const err = validateNguonForm(form);
    if (err) { onError(err); return; }
    setLoading(true);
    try {
      await submitNguonForm(mode, form, initial);
      onSuccess();
      onClose();
    } catch (e: any) {
      onError(e?.data?.message ?? "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={s.overlay}>
        <Pressable style={s.backdrop} onPress={onClose} />
        <View style={[s.sheet, { paddingBottom: insets.bottom + 16 }]}>
          <View style={s.header}>
            <ThemedText style={s.title}>
              {mode === "create" ? "Thêm hồ sơ Nguồn" : "Chỉnh sửa hồ sơ Nguồn"}
            </ThemedText>
            <Pressable onPress={onClose} hitSlop={8}>
              <X size={20} color="#6b7280" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <YouthFormField label="Họ và tên" required>
              <TextInput style={inputStyle} value={form.full_name} onChangeText={set("full_name")}
                placeholder="Nguyễn Văn An" placeholderTextColor="#9ca3af" />
            </YouthFormField>

            <YouthFormField label="Ngày sinh" required hint="(YYYY-MM-DD)">
              <TextInput style={inputStyle} value={form.date_of_birth} onChangeText={set("date_of_birth")}
                placeholder="2007-01-15" placeholderTextColor="#9ca3af"
                keyboardType="numbers-and-punctuation" />
            </YouthFormField>

            <YouthFormField label="Địa chỉ thường trú">
              <TextInput style={[inputStyle, s.multiline]} value={form.permanent_address}
                onChangeText={set("permanent_address")} placeholder="123 Đường ABC..."
                placeholderTextColor="#9ca3af" multiline numberOfLines={2} />
            </YouthFormField>

            <YouthFormField label="Địa chỉ tạm trú">
              <TextInput style={[inputStyle, s.multiline]} value={form.temporary_address}
                onChangeText={set("temporary_address")} placeholder="456 Đường XYZ..."
                placeholderTextColor="#9ca3af" multiline numberOfLines={2} />
            </YouthFormField>

            <YouthFormField label="Số điện thoại">
              <TextInput style={inputStyle} value={form.phone} onChangeText={set("phone")}
                placeholder="0901234567" placeholderTextColor="#9ca3af"
                keyboardType="phone-pad" maxLength={10} />
            </YouthFormField>

            <YouthFormField label="Trình độ văn hóa">
              <EducationLevelPicker
                value={form.education_level ?? ""}
                onChange={set("education_level")}
              />
            </YouthFormField>

            <YouthFormField label="Ghi chú">
              <TextInput style={[inputStyle, s.noteInput]} value={form.note}
                onChangeText={set("note")} placeholder="Ghi chú thêm..."
                placeholderTextColor="#9ca3af" multiline numberOfLines={3} />
            </YouthFormField>

            <View style={s.actions}>
              <Pressable style={s.btnCancel} onPress={onClose} disabled={loading}>
                <ThemedText style={s.btnCancelText}>Hủy</ThemedText>
              </Pressable>
              <Pressable style={[s.btnSubmit, loading && s.btnDisabled]}
                onPress={handleSubmit} disabled={loading}>
                {loading
                  ? <ActivityIndicator size="small" color="#fff" />
                  : <ThemedText style={s.btnSubmitText}>
                      {mode === "create" ? "Tạo hồ sơ" : "Lưu thay đổi"}
                    </ThemedText>}
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.4)" },
  sheet: { backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: "90%" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  title: { fontSize: 17, fontWeight: "700", color: "#111827" },
  multiline: { minHeight: 60, textAlignVertical: "top" },
  noteInput: { minHeight: 72, textAlignVertical: "top" },
  actions: { flexDirection: "row", gap: 10, marginTop: 4, marginBottom: 8 },
  btnCancel: { flex: 1, borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 10, paddingVertical: 13, alignItems: "center" },
  btnCancelText: { fontSize: 15, fontWeight: "600", color: "#374151" },
  btnSubmit: { flex: 1, backgroundColor: "#3b4a2e", borderRadius: 10, paddingVertical: 13, alignItems: "center" },
  btnSubmitText: { fontSize: 15, fontWeight: "600", color: "#fff" },
  btnDisabled: { opacity: 0.6 },
});
