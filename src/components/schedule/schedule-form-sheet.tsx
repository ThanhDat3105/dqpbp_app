import { ThemedText } from "@/components/themed-text";
import { OfficeColumn, ScheduleRow, scheduleApi } from "@/services/api/schedule";
import { userApi } from "@/services/api/user";
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

const PATROL_OPTIONS = Array.from({ length: 24 }, (_, i) => ({
  label: `A${i + 1}`,
  value: `a${i + 1}`,
}));

const FIXED_OFFICE: OfficeColumn[] = [
  { code: "hdnd_ubnd", label: "Trực HĐND – UBND" },
  { code: "du", label: "Trực Đảng ủy" },
  { code: "pktht", label: "Trực PKTHT" },
];

interface UserOpt { label: string; value: string }

function InlineSearch({
  value,
  onChange,
  options,
  loading,
  placeholder = "Chọn người trực...",
}: {
  value: string;
  onChange: (v: string) => void;
  options: UserOpt[];
  loading?: boolean;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const label = options.find((o) => o.value === value)?.label ?? value;
  const filtered = q
    ? options.filter((o) => o.label.toLowerCase().includes(q.toLowerCase()))
    : options;

  return (
    <View>
      <Pressable
        style={f.trigger}
        onPress={() => { setOpen((p) => !p); setQ(""); }}
      >
        <ThemedText style={{ color: label ? "#111827" : "#9ca3af", fontSize: 14 }}>
          {loading ? "Đang tải..." : label || placeholder}
        </ThemedText>
      </Pressable>
      {open && (
        <View style={f.dropdown}>
          <TextInput
            style={f.searchInput}
            value={q}
            onChangeText={setQ}
            placeholder="Tìm tên..."
            placeholderTextColor="#9ca3af"
            autoFocus
          />
          <ScrollView style={{ maxHeight: 160 }} keyboardShouldPersistTaps="handled">
            <Pressable
              style={f.item}
              onPress={() => { onChange(""); setOpen(false); }}
            >
              <ThemedText style={f.itemText}>— Bỏ chọn —</ThemedText>
            </Pressable>
            {filtered.map((opt) => (
              <Pressable
                key={opt.value}
                style={[f.item, value === opt.value && f.itemActive]}
                onPress={() => { onChange(opt.value); setOpen(false); }}
              >
                <ThemedText style={[f.itemText, value === opt.value && f.itemTextActive]}>
                  {opt.label}
                </ThemedText>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

interface Props {
  visible: boolean;
  row: ScheduleRow | null;
  dayLabel: string;
  officeColumns: OfficeColumn[];
  onClose: () => void;
  onSaved: (row: ScheduleRow) => void;
  onError: (msg: string) => void;
}

export function ScheduleFormSheet({
  visible,
  row,
  dayLabel,
  officeColumns,
  onClose,
  onSaved,
  onError,
}: Props) {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState<ScheduleRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [cmdOptions, setCmdOptions] = useState<UserOpt[]>([]);
  const [dqttOptions, setDqttOptions] = useState<UserOpt[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const allOffice = (() => {
    const fixedCodes = new Set(FIXED_OFFICE.map((c) => c.code));
    const extras = officeColumns.filter((c) => !fixedCodes.has(c.code));
    return [...FIXED_OFFICE, ...extras];
  })();

  useEffect(() => {
    if (row) setForm({ ...row });
  }, [row]);

  useEffect(() => {
    if (!visible) return;
    setLoadingUsers(true);
    Promise.all([
      userApi.getUsers({ role: "CHI_HUY", limit: 200 }),
      userApi.getUsers({ role: "TO_TRUONG", limit: 200 }),
      userApi.getUsers({ role: "DQTT", limit: 200 }),
    ])
      .then(([chiHuy, toTruong, dqtt]) => {
        const cmds = [...chiHuy, ...toTruong].map((u) => ({ label: u.name, value: u.name }));
        setCmdOptions(cmds);
        setDqttOptions(dqtt.map((u) => ({ label: u.name, value: u.name })));
      })
      .catch(() => onError("Không thể tải danh sách người dùng"))
      .finally(() => setLoadingUsers(false));
  }, [visible]);

  const set = (field: keyof ScheduleRow, val: unknown) =>
    setForm((prev) => prev ? { ...prev, [field]: val } : prev);

  const setOffice = (code: string, val: string) =>
    setForm((prev) =>
      prev ? { ...prev, office_duties: { ...prev.office_duties, [code]: val } } : prev,
    );

  const handleSave = async () => {
    if (!form) return;
    setSaving(true);
    try {
      const res = await scheduleApi.updateDay(form.date, form);
      onSaved(res.row);
      onClose();
    } catch {
      onError("Có lỗi xảy ra khi lưu.");
    } finally {
      setSaving(false);
    }
  };

  if (!form) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={s.overlay}>
        <Pressable style={s.backdrop} onPress={onClose} />
        <View style={[s.sheet, { paddingBottom: insets.bottom + 16 }]}>
          {/* Header */}
          <View style={s.sheetHeader}>
            <ThemedText style={s.sheetTitle}>Cập nhật lịch — {dayLabel}</ThemedText>
            <Pressable onPress={onClose} hitSlop={10}>
              <X size={20} color="#6b7280" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <Section label="Trực chỉ huy">
              <InlineSearch value={form.commander} onChange={(v) => set("commander", v)}
                options={cmdOptions} loading={loadingUsers} />
            </Section>
            <Section label="Trực ban">
              <InlineSearch value={form.duty_officer} onChange={(v) => set("duty_officer", v)}
                options={cmdOptions} loading={loadingUsers} />
            </Section>
            <Section label="Trực công văn">
              <InlineSearch value={form.document_officer} onChange={(v) => set("document_officer", v)}
                options={dqttOptions} loading={loadingUsers} />
            </Section>
            <Section label="Trực nội vụ">
              <InlineSearch value={form.internal_affairs} onChange={(v) => set("internal_affairs", v)}
                options={dqttOptions} loading={loadingUsers} />
            </Section>
            <Section label="Trực cơm">
              <InlineSearch value={form.meal_duty} onChange={(v) => set("meal_duty", v)}
                options={dqttOptions} loading={loadingUsers} />
            </Section>
            <Section label="DQTT phụ trách A">
              <InlineSearch value={form.dqtt_leader} onChange={(v) => set("dqtt_leader", v)}
                options={dqttOptions} loading={loadingUsers} />
            </Section>
            <Section label="DQCD trực – Tuần tra">
              <InlineSearch
                value={form.dqcd_patrol?.[0] ?? ""}
                onChange={(v) => set("dqcd_patrol", v ? [v] : [])}
                options={PATROL_OPTIONS}
              />
            </Section>

            {/* Office duties */}
            <View style={s.divider} />
            <ThemedText style={s.sectionGroupLabel}>Nhiệm vụ trực trụ sở</ThemedText>
            {allOffice.map((col) => (
              <Section key={col.code} label={col.label}>
                <InlineSearch
                  value={form.office_duties?.[col.code] ?? ""}
                  onChange={(v) => setOffice(col.code, v)}
                  options={dqttOptions}
                  loading={loadingUsers}
                />
              </Section>
            ))}

            {/* Actions */}
            <View style={s.actions}>
              <Pressable style={s.btnCancel} onPress={onClose} disabled={saving}>
                <ThemedText style={s.btnCancelText}>Hủy</ThemedText>
              </Pressable>
              <Pressable
                style={[s.btnSave, saving && s.btnDisabled]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving
                  ? <ActivityIndicator size="small" color="#fff" />
                  : <ThemedText style={s.btnSaveText}>Lưu thay đổi</ThemedText>}
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={s.field}>
      <ThemedText style={s.fieldLabel}>{label}</ThemedText>
      {children}
    </View>
  );
}

const f = StyleSheet.create({
  trigger: {
    borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10, backgroundColor: "#fafafa",
  },
  dropdown: {
    borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 10,
    marginTop: 4, backgroundColor: "#fff", overflow: "hidden",
  },
  searchInput: {
    paddingHorizontal: 12, paddingVertical: 8,
    fontSize: 14, borderBottomWidth: 1, borderBottomColor: "#f3f4f6", color: "#111827",
  },
  item: { paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#f9fafb" },
  itemActive: { backgroundColor: "#f0fdf4" },
  itemText: { fontSize: 14, color: "#374151" },
  itemTextActive: { color: "#15803d", fontWeight: "600" },
});

const s = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.4)" },
  sheet: { backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: "92%" },
  sheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  sheetTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },
  field: { marginBottom: 14 },
  fieldLabel: { fontSize: 13, fontWeight: "600", color: "#374151", marginBottom: 6 },
  divider: { height: 1, backgroundColor: "#f3f4f6", marginVertical: 12 },
  sectionGroupLabel: { fontSize: 14, fontWeight: "700", color: "#111827", marginBottom: 10 },
  actions: { flexDirection: "row", gap: 10, marginTop: 16, marginBottom: 8 },
  btnCancel: { flex: 1, borderWidth: 1, borderColor: "#e5e7eb", borderRadius: 10, paddingVertical: 13, alignItems: "center" },
  btnCancelText: { fontSize: 15, fontWeight: "600", color: "#374151" },
  btnSave: { flex: 1, backgroundColor: "#3b4a2e", borderRadius: 10, paddingVertical: 13, alignItems: "center" },
  btnSaveText: { fontSize: 15, fontWeight: "600", color: "#fff" },
  btnDisabled: { opacity: 0.6 },
});
