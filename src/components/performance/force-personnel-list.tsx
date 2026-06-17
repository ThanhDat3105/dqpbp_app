import { ChevronRight } from "lucide-react-native";
import { Pressable, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";

import { Users } from "@/services/api/user";
import { initials } from "./performance-helpers";
import { SkeletonBox } from "./performance-ui-atoms";

export const DEPARTMENT_MAP: Record<number, string> = {
  1: "Văn thư",
  2: "Tham mưu",
  3: "Chính trị",
  4: "Hậu cần - Kỹ thuật",
  5: "Động viên - Tuyển quân",
};

export function ForcePersonnelList({
  list,
  loading,
  loadingList,
  onSelectPerson,
  search,
  onSearchChange,
}: {
  list: Users[];
  loading: boolean;
  loadingList: boolean;
  onSelectPerson: (person: Users) => void;
  search: string;
  onSearchChange: (search: string) => void;
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

      <View className="px-4 py-2 border-b border-gray-50">
        <View className="flex-row items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
          <ThemedText style={{ fontSize: 12, color: "#9ca3af" }}>🔍</ThemedText>
          <TextInput
            value={search}
            onChangeText={onSearchChange}
            placeholder="Tìm theo tên..."
            placeholderTextColor="#9ca3af"
            style={{ flex: 1, fontSize: 13, color: "#111827" }}
          />
        </View>
      </View>

      {loading || loadingList ? (
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
          <Pressable
            key={person.id}
            onPress={() => onSelectPerson(person)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: "#f9fafb",
            }}
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
            <View style={{ flex: 1 }}>
              <ThemedText
                style={{ fontSize: 13, fontWeight: "600", color: "#111827" }}
                numberOfLines={1}
              >
                {person.name}
              </ThemedText>
              <ThemedText
                style={{ fontSize: 11, color: "#6b7280", marginTop: 1 }}
              >
                {`${person.role} · ${DEPARTMENT_MAP[person.department_id]}`}
              </ThemedText>
            </View>
            <ChevronRight size={14} color="#d1d5db" />
          </Pressable>
        ))
      )}
    </View>
  );
}
