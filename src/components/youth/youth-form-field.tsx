import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";

interface Props {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}

export function YouthFormField({ label, required, hint, children }: Props) {
  return (
    <View style={styles.field}>
      <ThemedText style={styles.label}>
        {label}
        {required && <ThemedText style={styles.required}> *</ThemedText>}
        {hint && <ThemedText style={styles.hint}> {hint}</ThemedText>}
      </ThemedText>
      {children}
    </View>
  );
}

export const inputStyle = {
  borderWidth: 1,
  borderColor: "#e5e7eb",
  borderRadius: 10,
  paddingHorizontal: 14,
  paddingVertical: 11,
  fontSize: 15,
  color: "#111827",
  backgroundColor: "#fafafa",
} as const;

const styles = StyleSheet.create({
  field: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "600", color: "#374151", marginBottom: 6 },
  required: { color: "#ef4444" },
  hint: { fontSize: 12, fontWeight: "400", color: "#9ca3af" },
});
