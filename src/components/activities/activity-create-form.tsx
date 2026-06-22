import dayjs from "dayjs";
import { ChevronLeft, Save } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/context/AuthContext";
import { axiosInstance } from "@/lib/axios.config";
import {
  ActivityInterface,
  ActivityTemplate,
  getActivityTemplateById,
  getActivityTemplates,
  getDepartmentLabel
} from "@/services/api/activity";

import {
  DatePickerInput,
  FieldLabel,
  SelectPill,
  StyledInput,
} from "./activity-form-atoms";
import {
  ActivityTaskDraftList,
  emptyTask,
  TaskDraft,
} from "./activity-task-draft-list";

const WORK_TYPE_OPTIONS = [
  { value: "suddenly", label: "Đột xuất" },
  { value: "annual", label: "Định kỳ" },
];

const FALLBACK_DEPTS = [
  { value: "administration_office", label: "Văn thư" },
  { value: "advise", label: "Tham mưu" },
  { value: "political_affairs", label: "Chính trị" },
  { value: "logistics", label: "Hậu cần" },
  { value: "mobilization_recruitment", label: "Động viên tuyển quân" },
];

export function ActivityCreateForm({
  onBack,
  onSuccess,
}: {
  onBack: () => void;
  onSuccess: (activity: ActivityInterface) => void;
}) {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();

  const [name, setName] = useState("");
  const [workType, setWorkType] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [documentNumber, setDocumentNumber] = useState("");
  const [tasks, setTasks] = useState<TaskDraft[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [deptOptions, setDeptOptions] = useState(FALLBACK_DEPTS);
  const [templates, setTemplates] = useState<ActivityTemplate[]>([]);
  const [applyingTemplate, setApplyingTemplate] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);

  useEffect(() => {
    getActivityTemplates()
      .then(setTemplates)
      .catch(() => {});
  }, []);

  const handleApplyTemplate = async (tpl: ActivityTemplate) => {
    setApplyingTemplate(true);
    setShowTemplatePicker(false);
    try {
      const detail = await getActivityTemplateById(tpl.id);
      if (detail.name) setName(detail.name);
      if (detail.work_type) setWorkType(detail.work_type);
      if (detail.department) setDepartment(detail.department);
      if (detail.location) setLocation(detail.location);
      if (detail.document_number) setDocumentNumber(detail.document_number);
      if (detail.tasks?.length) {
        setTasks(
          detail.tasks.map((t) => ({
            _key: Date.now() + Math.random(),
            title: t.title,
            team: t.team ?? [],
            assignees: (t.assignees ?? []).map(String),
            due_date: "",
            notes: t.notes ?? "",
            report_fields: t.report_fields ?? [],
            requires_dqcd: t.requires_dqcd ?? false,
            require_media_report: t.require_media_report ?? false,
          })),
        );
      }
    } catch {
      Alert.alert("Lỗi", "Không thể tải mẫu kế hoạch");
    } finally {
      setApplyingTemplate(false);
    }
  };

  useEffect(() => {
    axiosInstance
      .get("/api/department")
      .then((res) => {
        const list = res.data?.metaData ?? res.data?.data ?? [];
        if (Array.isArray(list) && list.length > 0) {
          setDeptOptions(
            list.map((d: any) => ({
              value: d.code ?? d.value ?? d,
              label: getDepartmentLabel(d.code ?? d.value ?? d),
            })),
          );
        }
      })
      .catch(() => {});
  }, []);

  const validate = useCallback(() => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Bắt buộc";
    if (!workType) e.work_type = "Bắt buộc";
    if (!department) e.department = "Bắt buộc";
    if (!startDate) e.start_date = "Bắt buộc";
    if (!endDate) e.end_date = "Bắt buộc";
    if (startDate && endDate && startDate > endDate)
      e.end_date = "Phải sau ngày bắt đầu";
    tasks.forEach((t, i) => {
      if (!t.title.trim()) e[`task_${i}_title`] = "Bắt buộc";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [name, workType, department, startDate, endDate, tasks]);

  const handleSubmit = async () => {
    if (!validate()) {
      Alert.alert("Kiểm tra lại", "Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    console.log("Submitting activity", tasks);

    return;
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: "#3b4a2e",
          paddingTop: 10,
          paddingBottom: 10,
          paddingHorizontal: 16,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Pressable onPress={onBack} style={{ marginRight: 12 }}>
          <ChevronLeft size={24} color="#fff" />
        </Pressable>
        <ThemedText
          style={{ flex: 1, color: "#fff", fontSize: 16, fontWeight: "700" }}
        >
          Tạo công tác mới
        </ThemedText>
        <Pressable
          onPress={handleSubmit}
          disabled={loading}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            backgroundColor: "#556B2F",
            paddingHorizontal: 14,
            paddingVertical: 7,
            borderRadius: 8,
          }}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Save size={15} color="#fff" />
              <ThemedText
                style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}
              >
                Lưu
              </ThemedText>
            </>
          )}
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: insets.bottom + 40,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Template picker */}
        {templates.length > 0 && (
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#f3f4f6",
              padding: 16,
              marginBottom: 12,
            }}
          >
            <FieldLabel label="Dùng mẫu có sẵn" />
            <Pressable
              onPress={() => setShowTemplatePicker(true)}
              disabled={applyingTemplate}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                borderWidth: 1,
                borderColor: "#e5e7eb",
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                backgroundColor: "#f9fafb",
              }}
            >
              {applyingTemplate ? (
                <ActivityIndicator size="small" color="#556B2F" />
              ) : (
                <ThemedText style={{ fontSize: 13, color: "#6b7280" }}>
                  -- Chọn mẫu kế hoạch --
                </ThemedText>
              )}
            </Pressable>
          </View>
        )}

        {/* Template picker modal */}
        <Modal
          visible={showTemplatePicker}
          transparent
          animationType="slide"
          onRequestClose={() => setShowTemplatePicker(false)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.4)",
              justifyContent: "flex-end",
            }}
          >
            <Pressable
              style={{ flex: 1 }}
              onPress={() => setShowTemplatePicker(false)}
            />
            <View
              style={{
                backgroundColor: "#fff",
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                maxHeight: "60%",
                paddingBottom: insets.bottom + 8,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  paddingTop: 10,
                  paddingBottom: 4,
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 4,
                    borderRadius: 2,
                    backgroundColor: "#d1d5db",
                  }}
                />
              </View>
              <ThemedText
                style={{
                  fontSize: 15,
                  fontWeight: "700",
                  color: "#111827",
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: "#f3f4f6",
                }}
              >
                Chọn mẫu kế hoạch
              </ThemedText>
              <ScrollView showsVerticalScrollIndicator={false}>
                {templates.map((tpl) => (
                  <Pressable
                    key={tpl.id}
                    onPress={() => handleApplyTemplate(tpl)}
                    style={{
                      paddingHorizontal: 20,
                      paddingVertical: 14,
                      borderBottomWidth: 1,
                      borderBottomColor: "#f9fafb",
                    }}
                  >
                    <ThemedText
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: "#111827",
                      }}
                    >
                      {tpl.name}
                    </ThemedText>
                    {tpl.tasks?.length > 0 && (
                      <ThemedText
                        style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}
                      >
                        {tpl.tasks.length} nhiệm vụ
                      </ThemedText>
                    )}
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Basic info */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#f3f4f6",
            padding: 16,
            marginBottom: 12,
            gap: 14,
          }}
        >
          <ThemedText
            style={{ fontSize: 14, fontWeight: "700", color: "#111827" }}
          >
            Thông tin cơ bản
          </ThemedText>

          <View>
            <FieldLabel label="Tên kế hoạch" required />
            <StyledInput
              value={name}
              onChangeText={setName}
              placeholder="VD: Huấn luyện sử dụng vũ khí"
              error={!!errors.name}
            />
            {errors.name && (
              <ThemedText
                style={{ fontSize: 11, color: "#ef4444", marginTop: 2 }}
              >
                {errors.name}
              </ThemedText>
            )}
          </View>

          <View>
            <FieldLabel label="Loại hoạt động" required />
            <SelectPill
              options={WORK_TYPE_OPTIONS}
              value={workType}
              onChange={setWorkType}
            />
            {errors.work_type && (
              <ThemedText
                style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}
              >
                {errors.work_type}
              </ThemedText>
            )}
          </View>

          <View>
            <FieldLabel label="Tổ công tác" required />
            <SelectPill
              options={deptOptions}
              value={department}
              onChange={setDepartment}
            />
            {errors.department && (
              <ThemedText
                style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}
              >
                {errors.department}
              </ThemedText>
            )}
          </View>

          <View>
            <FieldLabel label="Địa điểm" />
            <StyledInput
              value={location}
              onChangeText={setLocation}
              placeholder="VD: Sân tập P10"
            />
          </View>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <View style={{ flex: 1 }}>
              <FieldLabel label="Ngày bắt đầu" required />
              <DatePickerInput
                value={startDate}
                onChange={setStartDate}
                error={!!errors.start_date}
              />
            </View>
            <View style={{ flex: 1 }}>
              <FieldLabel label="Ngày kết thúc" required />
              <DatePickerInput
                value={endDate}
                onChange={setEndDate}
                error={!!errors.end_date}
              />
              {errors.end_date && (
                <ThemedText
                  style={{ fontSize: 11, color: "#ef4444", marginTop: 2 }}
                >
                  {errors.end_date}
                </ThemedText>
              )}
            </View>
          </View>

          <View>
            <FieldLabel label="Số công văn" />
            <StyledInput
              value={documentNumber}
              onChangeText={setDocumentNumber}
              placeholder="VD: 123/CV..."
            />
          </View>
        </View>

        {/* Tasks */}
        <ActivityTaskDraftList
          tasks={tasks}
          errors={errors}
          onAdd={() => setTasks((prev) => [...prev, emptyTask(Date.now())])}
          onRemove={(key) =>
            setTasks((prev) => prev.filter((t) => t._key !== key))
          }
          onUpdate={(key, patch) =>
            setTasks((prev) =>
              prev.map((t) => (t._key === key ? { ...t, ...patch } : t)),
            )
          }
        />
      </ScrollView>
    </View>
  );
}
