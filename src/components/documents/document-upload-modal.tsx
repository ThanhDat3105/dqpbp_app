import { ThemedText } from "@/components/themed-text";
import {
  YouthFormField,
  inputStyle,
} from "@/components/youth/youth-form-field";
import { DepartmentItem, documentApi } from "@/services/api/document";
import * as DocumentPicker from "expo-document-picker";
import { FileText, Upload, X } from "lucide-react-native";
import { useState } from "react";
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

function InlinePicker({
  value,
  placeholder,
  options,
  onChange,
}: {
  value: string;
  placeholder: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const label = options.find((o) => o.value === value)?.label;
  return (
    <View>
      <Pressable style={ps.trigger} onPress={() => setOpen((p) => !p)}>
        <ThemedText
          style={{ color: label ? "#111827" : "#9ca3af", fontSize: 15 }}
        >
          {label ?? placeholder}
        </ThemedText>
      </Pressable>
      {open && (
        <View style={ps.dropdown}>
          {options.map((opt) => (
            <Pressable
              key={opt.value}
              style={[ps.item, value === opt.value && ps.itemActive]}
              onPress={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              <ThemedText
                style={[ps.itemText, value === opt.value && ps.itemTextActive]}
              >
                {opt.label}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

interface Props {
  visible: boolean;
  departments: DepartmentItem[];
  onClose: () => void;
  onSuccess: () => void;
  onError: (msg: string) => void;
}

export function DocumentUploadModal({
  visible,
  departments,
  onClose,
  onSuccess,
  onError,
}: Props) {
  const insets = useSafeAreaInsets();
  const [file, setFile] = useState<{
    uri: string;
    name: string;
    mimeType: string;
  } | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [isPublic, setIsPublic] = useState("false");
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setFile(null);
    setTitle("");
    setDescription("");
    setDepartmentId("");
    setIsPublic("false");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      const asset = result.assets[0];
      setFile({
        uri: asset.uri,
        name: asset.name,
        mimeType: asset.mimeType ?? "application/octet-stream",
      });
      if (!title) setTitle(asset.name.replace(/\.[^.]+$/, ""));
    } catch {}
  };

  const handleSubmit = async () => {
    if (!file) {
      onError("Vui lòng chọn file");
      return;
    }
    if (!title.trim()) {
      onError("Vui lòng nhập tiêu đề");
      return;
    }
    if (!departmentId) {
      onError("Vui lòng chọn tổ công tác");
      return;
    }

    setLoading(true);
    try {
      await documentApi.upload(file.uri, file.name, file.mimeType, {
        title: title.trim(),
        description: description.trim() || undefined,
        department_id: Number(departmentId),
        is_public: isPublic === "true",
      });
      onSuccess();
      handleClose();
    } catch {
      onError("Có lỗi xảy ra khi tải lên");
    } finally {
      setLoading(false);
    }
  };

  const deptOptions = departments.map((d) => ({
    value: String(d.id),
    label: d.name,
  }));
  const visibilityOptions = [
    { value: "false", label: "Nội bộ" },
    { value: "true", label: "Công khai" },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View style={s.overlay}>
        <Pressable style={s.backdrop} onPress={handleClose} />
        <View style={[s.sheet, { paddingBottom: insets.bottom + 16 }]}>
          <View style={s.header}>
            <ThemedText style={s.title}>Tải lên tài liệu</ThemedText>
            <Pressable onPress={handleClose} hitSlop={8}>
              <X size={20} color="#6b7280" />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* File picker */}
            <Pressable style={s.filePicker} onPress={pickFile}>
              {file ? (
                <>
                  <FileText size={32} color="#3b82f6" />
                  <ThemedText style={s.filePickerName} numberOfLines={2}>
                    {file.name}
                  </ThemedText>
                  <ThemedText style={s.filePickerHint}>
                    Nhấn để chọn file khác
                  </ThemedText>
                </>
              ) : (
                <>
                  <Upload size={32} color="#9ca3af" />
                  <ThemedText style={s.filePickerLabel}>
                    Nhấn để chọn file
                  </ThemedText>
                  <ThemedText style={s.filePickerHint}>
                    PDF, DOC, DOCX, XLS, XLSX, PNG...
                  </ThemedText>
                </>
              )}
            </Pressable>
            {file && (
              <Pressable style={s.removeFile} onPress={() => setFile(null)}>
                <X size={12} color="#ef4444" />
                <ThemedText style={s.removeFileText}>Xóa file</ThemedText>
              </Pressable>
            )}

            <YouthFormField label="Tiêu đề" required>
              <TextInput
                style={inputStyle}
                value={title}
                onChangeText={setTitle}
                placeholder="Nhập tiêu đề tài liệu"
                placeholderTextColor="#9ca3af"
              />
            </YouthFormField>

            <YouthFormField label="Mô tả">
              <TextInput
                style={[inputStyle, s.descInput]}
                value={description}
                onChangeText={setDescription}
                placeholder="Mô tả ngắn (tuỳ chọn)"
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={2}
              />
            </YouthFormField>

            <YouthFormField label="Tổ công tác" required>
              <InlinePicker
                value={departmentId}
                placeholder="-- Chọn tổ --"
                options={deptOptions}
                onChange={setDepartmentId}
              />
            </YouthFormField>

            <YouthFormField label="Phạm vi">
              <InlinePicker
                value={isPublic}
                placeholder="Nội bộ"
                options={visibilityOptions}
                onChange={setIsPublic}
              />
            </YouthFormField>

            <View style={s.actions}>
              <Pressable
                style={s.btnCancel}
                onPress={handleClose}
                disabled={loading}
              >
                <ThemedText style={s.btnCancelText}>Hủy</ThemedText>
              </Pressable>
              <Pressable
                style={[s.btnSubmit, loading && s.btnDisabled]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <ThemedText style={s.btnSubmitText}>Tải lên</ThemedText>
                )}
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const ps = StyleSheet.create({
  trigger: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    backgroundColor: "#fafafa",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    marginTop: 4,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  item: {
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  itemActive: { backgroundColor: "#f0fdf4" },
  itemText: { fontSize: 15, color: "#374151" },
  itemTextActive: { color: "#16a34a", fontWeight: "600" },
});

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
  title: { fontSize: 17, fontWeight: "700", color: "#111827" },
  filePicker: {
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
    borderRadius: 12,
    paddingVertical: 24,
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
    backgroundColor: "#fafafa",
  },
  filePickerLabel: { fontSize: 14, fontWeight: "600", color: "#374151" },
  filePickerName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3b82f6",
    textAlign: "center",
    paddingHorizontal: 16,
  },
  filePickerHint: { fontSize: 12, color: "#9ca3af" },
  removeFile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  removeFileText: { fontSize: 12, color: "#ef4444" },
  descInput: { minHeight: 60, textAlignVertical: "top" },
  actions: { flexDirection: "row", gap: 10, marginTop: 8, marginBottom: 8 },
  btnCancel: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
  },
  btnCancelText: { fontSize: 15, fontWeight: "600", color: "#374151" },
  btnSubmit: {
    flex: 1,
    backgroundColor: "#3b4a2e",
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
  },
  btnSubmitText: { fontSize: 15, fontWeight: "600", color: "#fff" },
  btnDisabled: { opacity: 0.6 },
});
