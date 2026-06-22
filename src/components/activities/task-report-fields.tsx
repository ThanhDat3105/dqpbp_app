import { ThemedText } from "@/components/themed-text";
import { TextInput, View } from "react-native";

interface ReportField {
  name: string;
  value: string;
}

export function TaskReportFields({
  fields,
  readonly,
  onChange,
}: {
  fields: ReportField[];
  readonly?: boolean;
  onChange?: (fields: ReportField[]) => void;
}) {
  if (fields.length === 0) return null;

  if (readonly) {
    return (
      <View style={{ gap: 6 }}>
        {fields
          .filter((f) => f.value)
          .map((field) => (
            <View key={field.name} style={{ flexDirection: "row", gap: 4 }}>
              <ThemedText style={{ fontSize: 12, color: "#6b7280" }}>
                {field.name}:
              </ThemedText>
              <ThemedText
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: "#111827",
                  flex: 1,
                }}
              >
                {field.value}
              </ThemedText>
            </View>
          ))}
      </View>
    );
  }

  return (
    <View style={{ gap: 8 }}>
      {fields.map((field, idx) => (
        <View key={idx}>
          <ThemedText
            style={{
              fontSize: 12,
              color: "#374151",
              fontWeight: "600",
              marginBottom: 4,
            }}
          >
            {field.name}
          </ThemedText>
          <TextInput
            value={field.value}
            onChangeText={(v) =>
              onChange?.(
                fields.map((f, i) => (i === idx ? { ...f, value: v } : f)),
              )
            }
            placeholder="Nhập câu trả lời..."
            placeholderTextColor="#9ca3af"
            style={{
              borderWidth: 1,
              borderColor: "#e5e7eb",
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 8,
              fontSize: 13,
              color: "#111827",
              backgroundColor: "#f9fafb",
            }}
          />
        </View>
      ))}
    </View>
  );
}
