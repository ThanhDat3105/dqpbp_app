import { ChevronDown, ChevronUp } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { OfficeColumn, ScheduleRow } from "@/services/api/schedule";

const FIXED_OFFICE: OfficeColumn[] = [
  { code: "hdnd_ubnd", label: "Trực HĐND – UBND" },
  { code: "du", label: "Trực Đảng ủy" },
  { code: "pktht", label: "Trực PKTHT" },
];

const FIELD_LABELS: { key: keyof ScheduleRow | string; label: string }[] = [
  { key: "commander", label: "Trực chỉ huy" },
  { key: "duty_officer", label: "Trực ban" },
  { key: "document_officer", label: "Trực công văn" },
  { key: "internal_affairs", label: "Trực nội vụ" },
  { key: "meal_duty", label: "Trực cơm" },
];

interface Props {
  row: ScheduleRow;
  dayLabel: string;
  dateLabel: string;
  isToday: boolean;
  isExpanded: boolean;
  canEdit: boolean;
  officeColumns: OfficeColumn[];
  assignedCount: number;
  totalCount: number;
  onToggle: () => void;
  onEdit: () => void;
}

function FieldRow({ label, value }: { label: string; value: string | undefined }) {
  const empty = !value || value.trim() === "";
  return (
    <View style={f.fieldRow}>
      <ThemedText style={f.fieldLabel}>{label}</ThemedText>
      {empty ? (
        <ThemedText style={f.fieldEmpty}>Phân công +</ThemedText>
      ) : (
        <ThemedText style={f.fieldValue}>{value}</ThemedText>
      )}
    </View>
  );
}

export function ScheduleDayRow({
  row,
  dayLabel,
  dateLabel,
  isToday,
  isExpanded,
  canEdit,
  officeColumns,
  assignedCount,
  totalCount,
  onToggle,
  onEdit,
}: Props) {
  const allOffice = (() => {
    const fixedCodes = new Set(FIXED_OFFICE.map((c) => c.code));
    const extras = officeColumns.filter((c) => !fixedCodes.has(c.code));
    return [...FIXED_OFFICE, ...extras];
  })();

  const patrolCodes = Array.isArray(row.dqcd_patrol) ? row.dqcd_patrol : [];

  return (
    <View style={[s.card, isToday && s.cardToday]}>
      {/* Accordion header */}
      <Pressable style={s.header} onPress={onToggle}>
        <View style={s.headerLeft}>
          <View style={[s.dayBadge, isToday && s.dayBadgeToday]}>
            <ThemedText style={[s.dayText, isToday && s.dayTextToday]}>
              {dayLabel}
            </ThemedText>
            <ThemedText style={[s.dateText, isToday && s.dateTextToday]}>
              {dateLabel}
            </ThemedText>
          </View>
          {isToday && (
            <View style={s.todayChip}>
              <ThemedText style={s.todayChipText}>Hôm nay</ThemedText>
            </View>
          )}
        </View>

        <View style={s.headerRight}>
          <View style={s.countBadge}>
            <ThemedText style={s.countText}>
              {assignedCount}/{totalCount}
            </ThemedText>
          </View>
          {isExpanded ? (
            <ChevronUp size={18} color="#6b7280" />
          ) : (
            <ChevronDown size={18} color="#6b7280" />
          )}
        </View>
      </Pressable>

      {/* Expanded content */}
      {isExpanded && (
        <View style={s.body}>
          {/* Fixed fields */}
          {FIELD_LABELS.map((fl) => (
            <FieldRow
              key={fl.key}
              label={fl.label}
              value={row[fl.key as keyof ScheduleRow] as string}
            />
          ))}

          {/* Dynamic office duties */}
          {allOffice.map((col) => (
            <FieldRow
              key={col.code}
              label={col.label}
              value={row.office_duties?.[col.code]}
            />
          ))}

          {/* DQTT */}
          <FieldRow label="DQTT phụ trách A" value={row.dqtt_leader} />

          {/* DQCD patrol */}
          <View style={f.fieldRow}>
            <ThemedText style={f.fieldLabel}>DQCD trực – Tuần tra</ThemedText>
            {patrolCodes.length > 0 ? (
              <View style={s.patrolWrap}>
                {patrolCodes.map((code) => (
                  <View key={code} style={s.patrolChip}>
                    <ThemedText style={s.patrolChipText}>
                      {code.toUpperCase()}
                    </ThemedText>
                  </View>
                ))}
              </View>
            ) : (
              <ThemedText style={f.fieldEmpty}>Phân công +</ThemedText>
            )}
          </View>

          {/* Edit button */}
          {canEdit && (
            <Pressable style={s.editBtn} onPress={onEdit}>
              <ThemedText style={s.editBtnText}>Chỉnh sửa ngày này</ThemedText>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

const f = StyleSheet.create({
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  fieldLabel: { fontSize: 13, color: "#6b7280", flex: 1 },
  fieldValue: { fontSize: 13, fontWeight: "600", color: "#111827", textAlign: "right", flex: 1 },
  fieldEmpty: { fontSize: 12, color: "#d1d5db", fontStyle: "italic", textAlign: "right" },
});

const OLIVE = "#3b4a2e";

const s = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  cardToday: {
    borderWidth: 1.5,
    borderColor: OLIVE,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  dayBadge: {
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: "center",
    minWidth: 68,
  },
  dayBadgeToday: { backgroundColor: OLIVE },
  dayText: { fontSize: 13, fontWeight: "700", color: "#374151" },
  dayTextToday: { color: "#fff" },
  dateText: { fontSize: 11, color: "#6b7280", marginTop: 1 },
  dateTextToday: { color: "#d4e3c0" },
  todayChip: {
    backgroundColor: "#dcfce7",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  todayChipText: { fontSize: 11, fontWeight: "700", color: "#15803d" },
  countBadge: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  countText: { fontSize: 12, fontWeight: "600", color: "#374151" },
  body: { paddingHorizontal: 14, paddingBottom: 14 },
  patrolWrap: { flexDirection: "row", flexWrap: "wrap", gap: 6, justifyContent: "flex-end" },
  patrolChip: {
    backgroundColor: "#e8edd4",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "#c8d8a0",
  },
  patrolChipText: { fontSize: 11, fontWeight: "700", color: OLIVE },
  editBtn: {
    marginTop: 12,
    backgroundColor: OLIVE,
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: "center",
  },
  editBtnText: { fontSize: 14, fontWeight: "700", color: "#fff" },
});
