import { ThemedText } from "@/components/themed-text";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

interface Props {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  confirmColor: string;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function YouthConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  confirmColor,
  loading,
  onCancel,
  onConfirm,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={s.overlay}>
        <View style={s.box}>
          <ThemedText style={s.title}>{title}</ThemedText>
          <ThemedText style={s.message}>{message}</ThemedText>
          <View style={s.actions}>
            <Pressable
              style={s.btnCancel}
              onPress={onCancel}
              disabled={loading}
            >
              <ThemedText style={s.btnCancelText}>Hủy</ThemedText>
            </Pressable>
            <Pressable
              style={[
                s.btnConfirm,
                { backgroundColor: confirmColor },
                loading && s.disabled,
              ]}
              onPress={onConfirm}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <ThemedText style={s.btnConfirmText}>{confirmLabel}</ThemedText>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  box: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 22,
    width: "100%",
  },
  title: { fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 8 },
  message: { fontSize: 14, color: "#4b5563", lineHeight: 20, marginBottom: 20 },
  actions: { flexDirection: "row", gap: 10 },
  btnCancel: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  btnCancelText: { fontSize: 15, fontWeight: "600", color: "#374151" },
  btnConfirm: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  btnConfirmText: { fontSize: 15, fontWeight: "600", color: "#fff" },
  disabled: { opacity: 0.6 },
});
