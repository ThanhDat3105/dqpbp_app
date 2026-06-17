import { ThemedText } from "@/components/themed-text";
import { PersonnelItem } from "@/services/api/personnel";
import { Pressable, View } from "react-native";
import { STATUS_LABELS } from "./performance-constants";
import { formatShift, initials } from "./performance-helpers";
import { SkeletonBox } from "./performance-ui-atoms";

export function ForcePersonnelList({
  list,
  loading,
}: {
  list: PersonnelItem[];
  loading: boolean;
}) {
  return (
    <View className="mx-4 mb-3 rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <View className="flex-row items-center justify-between px-4 pt-4 pb-3 border-b border-gray-50">
        <ThemedText
          style={{ fontSize: 13, fontWeight: "700", color: "#111827" }}
        >
          Danh sách DQTT
        </ThemedText>
        <Pressable>
          <ThemedText
            style={{ fontSize: 12, color: "#556B2F", fontWeight: "600" }}
          >
            Xem tất cả →
          </ThemedText>
        </Pressable>
      </View>

      {loading ? (
        <View className="p-4" style={{ gap: 10 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <SkeletonBox key={i} height={52} />
          ))}
        </View>
      ) : list.length === 0 ? (
        <ThemedText
          style={{
            fontSize: 13,
            color: "#9ca3af",
            textAlign: "center",
            padding: 24,
          }}
        >
          Không có nhân sự nào đang trực
        </ThemedText>
      ) : (
        list.map((person) => (
          <View
            key={person.id}
            className="flex-row items-center gap-3 px-4 py-3 border-b border-gray-50"
          >
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: "#e0e7ff",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ThemedText
                style={{ fontSize: 12, fontWeight: "700", color: "#4338ca" }}
              >
                {initials(person.name)}
              </ThemedText>
            </View>
            <View className="flex-1">
              <ThemedText
                style={{ fontSize: 13, fontWeight: "600", color: "#111827" }}
                numberOfLines={1}
              >
                {person.name}
              </ThemedText>
              <ThemedText
                style={{ fontSize: 11, color: "#6b7280", marginTop: 1 }}
              >
                {`${person.role} · ${person.department_name}`}
              </ThemedText>
            </View>
            <View className="items-end">
              <View
                style={{
                  paddingHorizontal: 7,
                  paddingVertical: 2,
                  borderRadius: 99,
                  backgroundColor:
                    person.status === "on_duty" ? "#d1fae5" : "#fef3c7",
                  marginBottom: 2,
                }}
              >
                <ThemedText
                  style={{
                    fontSize: 10,
                    fontWeight: "600",
                    color: person.status === "on_duty" ? "#065f46" : "#92400e",
                  }}
                >
                  {STATUS_LABELS[person.status] ?? person.status}
                </ThemedText>
              </View>
              <ThemedText style={{ fontSize: 10, color: "#9ca3af" }}>
                {formatShift(person.shift_start_at)}
              </ThemedText>
            </View>
          </View>
        ))
      )}
    </View>
  );
}
