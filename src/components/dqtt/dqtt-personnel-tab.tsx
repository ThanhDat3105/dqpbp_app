import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Users } from "@/services/api/user";

import { DqttDetailSheet } from "./dqtt-detail-sheet";
import { DqttListItem } from "./dqtt-list-item";
import { DqttScreenHeader, DqttSearchToolbar } from "./dqtt-screen-header";
import { useDqttList } from "./use-dqtt-list";

const NUM_COLUMNS = 2;

export default function DqttPersonnelTab() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<Users | null>(null);

  const { rows, loading, debouncedSearch } = useDqttList(search);
  const isEmpty = !loading && rows.length === 0;

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <DqttScreenHeader total={rows.length} />
      <DqttSearchToolbar search={search} onSearchChange={setSearch} />

      {loading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color="#556B2F" />
        </View>
      ) : isEmpty ? (
        <View style={s.center}>
          <Text style={s.emptyText}>
            {debouncedSearch
              ? "Không tìm thấy nhân sự nào khớp với từ khóa"
              : "Chưa có nhân sự nào"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(item) => String(item.id)}
          numColumns={NUM_COLUMNS}
          renderItem={({ item }) => (
            <View style={s.col}>
              <DqttListItem item={item} onPress={() => setSelectedUser(item)} />
            </View>
          )}
          contentContainerStyle={[
            s.list,
            { padding: 16, paddingBottom: insets.bottom + 100 },
          ]}
        />
      )}

      <DqttDetailSheet
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />
    </View>
  );
}

const s = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
    paddingHorizontal: 32,
  },
  list: { padding: 10 },
  col: { flex: 1, margin: 6 },
});
