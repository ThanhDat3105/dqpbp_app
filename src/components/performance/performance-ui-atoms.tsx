import { View, Pressable } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { KpiPeriod } from "@/services/api/kpi";
import { PERIOD_LABELS } from "./performance-constants";

// ─── Skeleton ─────────────────────────────────────────────────────────────────

export function SkeletonBox({
  height = 48,
  style,
}: {
  height?: number;
  style?: object;
}) {
  return (
    <View
      style={[
        { height, backgroundColor: "#e5e7eb", borderRadius: 10 },
        style,
      ]}
    />
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

export function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <View
      style={{
        height: 6,
        flex: 1,
        backgroundColor: "#f3f4f6",
        borderRadius: 99,
        overflow: "hidden",
      }}
    >
      <View
        style={{
          width: `${Math.min(100, Math.max(0, value))}%`,
          height: "100%",
          backgroundColor: color,
          borderRadius: 99,
        }}
      />
    </View>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

export function StatCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  valueColor,
}: {
  label: string;
  value: string | number;
  icon: any;
  iconBg: string;
  iconColor: string;
  valueColor?: string;
}) {
  return (
    <View className="flex-1 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
      <View className="mb-2 flex-row items-center justify-between">
        <ThemedText style={{ fontSize: 11, color: "#6b7280" }}>{label}</ThemedText>
        <View style={{ backgroundColor: iconBg, borderRadius: 8, padding: 6 }}>
          <Icon size={14} color={iconColor} />
        </View>
      </View>
      <ThemedText
        style={{ fontSize: 22, fontWeight: "700", color: valueColor ?? "#111827" }}
      >
        {value}
      </ThemedText>
    </View>
  );
}

// ─── Period Selector ──────────────────────────────────────────────────────────

export function PeriodSelector({
  value,
  onChange,
}: {
  value: KpiPeriod;
  onChange: (p: KpiPeriod) => void;
}) {
  return (
    <View className="flex-row rounded-xl bg-gray-100 p-1">
      {(Object.keys(PERIOD_LABELS) as KpiPeriod[]).map((p) => (
        <Pressable
          key={p}
          onPress={() => onChange(p)}
          className={`flex-1 items-center rounded-lg py-1.5 ${
            value === p ? "bg-white shadow-sm" : ""
          }`}
        >
          <ThemedText
            style={{
              fontSize: 12,
              fontWeight: value === p ? "700" : "400",
              color: value === p ? "#3b4a2e" : "#6b7280",
            }}
          >
            {PERIOD_LABELS[p]}
          </ThemedText>
        </Pressable>
      ))}
    </View>
  );
}
