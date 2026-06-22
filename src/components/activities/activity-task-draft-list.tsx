import { ThemedText } from "@/components/themed-text";
import { Plus, Trash2 } from "lucide-react-native";
import { Pressable, View } from "react-native";
import {
  DateTimePickerInput,
  FieldLabel,
  StyledInput,
} from "./activity-form-atoms";

export interface TaskDraft {
  _key: number;
  title: string;
  team: string[];
  assignees: string[];
  due_date: string;
  notes: string;
  report_fields: { name: string; value: string }[];
  requires_dqcd: boolean;
  require_media_report: boolean;
}

export function emptyTask(key: number): TaskDraft {
  return {
    _key: key,
    title: "",
    team: [],
    assignees: [],
    due_date: "",
    notes: "",
    report_fields: [],
    requires_dqcd: false,
    require_media_report: false,
  };
}

export function ActivityTaskDraftList({
  tasks,
  errors,
  onAdd,
  onRemove,
  onUpdate,
}: {
  tasks: TaskDraft[];
  errors: Record<string, string>;
  onAdd: () => void;
  onRemove: (key: number) => void;
  onUpdate: (key: number, patch: Partial<TaskDraft>) => void;
}) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#f3f4f6",
        padding: 16,
        marginBottom: 12,
        gap: 12,
      }}
    >
      <ThemedText style={{ fontSize: 14, fontWeight: "700", color: "#111827" }}>
        Nhiệm vụ
      </ThemedText>

      {tasks.map((task, idx) => (
        <View
          key={task._key}
          style={{
            borderWidth: 1,
            borderColor: "#e5e7eb",
            borderRadius: 10,
            padding: 12,
            gap: 10,
            backgroundColor: "#f9fafb",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <ThemedText
              style={{ fontSize: 12, fontWeight: "700", color: "#6b7280" }}
            >
              Nhiệm vụ {idx + 1}
            </ThemedText>
            <Pressable onPress={() => onRemove(task._key)}>
              <Trash2 size={16} color="#ef4444" />
            </Pressable>
          </View>

          <View>
            <FieldLabel label="Tên nhiệm vụ" required />
            <StyledInput
              value={task.title}
              onChangeText={(v) => onUpdate(task._key, { title: v })}
              placeholder="Nhập tên nhiệm vụ..."
              error={!!errors[`task_${idx}_title`]}
            />
            {errors[`task_${idx}_title`] && (
              <ThemedText
                style={{ fontSize: 11, color: "#ef4444", marginTop: 2 }}
              >
                {errors[`task_${idx}_title`]}
              </ThemedText>
            )}
          </View>

          <View>
            <FieldLabel label="Hạn hoàn thành" required />
            <DateTimePickerInput
              value={task.due_date}
              onChange={(v) => onUpdate(task._key, { due_date: v })}
              error={!!errors[`task_${idx}_due_date`]}
            />
            {errors[`task_${idx}_due_date`] && (
              <ThemedText
                style={{ fontSize: 11, color: "#ef4444", marginTop: 2 }}
              >
                {errors[`task_${idx}_due_date`]}
              </ThemedText>
            )}
          </View>

          <View>
            <FieldLabel label="Ghi chú" />
            <StyledInput
              value={task.notes}
              onChangeText={(v) => onUpdate(task._key, { notes: v })}
              placeholder="Ghi chú thêm..."
              multiline
            />
          </View>
        </View>
      ))}

      <Pressable
        onPress={onAdd}
        style={{
          borderWidth: 1,
          borderStyle: "dashed",
          borderColor: "#556B2F",
          borderRadius: 10,
          paddingVertical: 12,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
          gap: 6,
          backgroundColor: "#f4fae8",
        }}
      >
        <Plus size={16} color="#556B2F" />
        <ThemedText
          style={{ fontSize: 13, fontWeight: "700", color: "#556B2F" }}
        >
          Thêm nhiệm vụ
        </ThemedText>
      </Pressable>
    </View>
  );
}
