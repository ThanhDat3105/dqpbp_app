import { FileX, Plus, Search } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DocumentFilterChips } from "@/components/documents/document-filter-chips";
import { DocumentListItem } from "@/components/documents/document-list-item";
import { DocumentUploadModal } from "@/components/documents/document-upload-modal";
import { useDocumentList } from "@/components/documents/use-document-list";
import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/context/AuthContext";
import { DepartmentItem, documentApi } from "@/services/api/document";

export default function DocumentsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const isReadOnly = user?.role === "DQCD";

  const [search, setSearch] = useState("");
  const [selectedDept, setSelectedDept] = useState<number | null>(null);
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    if (ToastAndroid?.show) {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      setToast(msg);
      setTimeout(() => setToast(null), 2500);
    }
  };

  useEffect(() => {
    documentApi
      .fetchDepartments()
      .then(setDepartments)
      .catch(() => {});
  }, []);

  const {
    rows,
    total,
    loading,
    loadingMore,
    loadMore,
    refresh,
    debouncedSearch,
  } = useDocumentList(search, selectedDept);

  const handleDeptCardPress = (deptId: number) => {
    setSelectedDept((prev) => (prev === deptId ? null : deptId));
  };

  const isEmpty = !loading && rows.length === 0;
  const showCategories = !debouncedSearch && selectedDept === null;

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <FlatList
        data={rows}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <DocumentListItem item={item} />}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        ListHeaderComponent={
          <View>
            {/* Header */}
            <View style={s.header}>
              <View>
                <ThemedText style={s.headerTitle}>Tài liệu QS-QP</ThemedText>
                <ThemedText style={s.headerSub}>{total} tài liệu</ThemedText>
              </View>
              {!isReadOnly && (
                <Pressable
                  style={s.addBtn}
                  onPress={() => setUploadVisible(true)}
                >
                  <Plus size={18} color="#fff" />
                </Pressable>
              )}
            </View>

            {/* Search bar */}
            <View style={s.searchBar}>
              <Search size={16} color="#9ca3af" style={{ marginRight: 8 }} />
              <TextInput
                style={s.searchInput}
                value={search}
                onChangeText={(v) => {
                  setSearch(v);
                  setSelectedDept(null);
                }}
                placeholder="Tìm văn bản, tài liệu..."
                placeholderTextColor="#9ca3af"
                clearButtonMode="while-editing"
              />
            </View>

            {/* Filter chips */}
            <DocumentFilterChips
              selected={selectedDept}
              departments={departments}
              onChange={(id) => {
                setSelectedDept(id);
                setSearch("");
              }}
            />

            {/* Section label */}
            <View style={s.sectionHeader}>
              <ThemedText style={s.sectionTitle}>
                {debouncedSearch || selectedDept
                  ? "Kết quả tìm kiếm"
                  : "Mới cập nhật"}
              </ThemedText>
              {(debouncedSearch || selectedDept) && (
                <Pressable
                  onPress={() => {
                    setSearch("");
                    setSelectedDept(null);
                  }}
                >
                  <ThemedText style={s.clearText}>Xóa lọc</ThemedText>
                </Pressable>
              )}
            </View>

            {/* Loading state */}
            {loading && (
              <View style={s.center}>
                <ActivityIndicator size="large" color="#556B2F" />
              </View>
            )}
            {isEmpty && !loading && (
              <View style={s.emptyWrap}>
                <FileX size={48} color="#d1d5db" />
                <Text style={s.emptyText}>
                  {debouncedSearch
                    ? "Không tìm thấy tài liệu nào"
                    : "Chưa có tài liệu nào"}
                </Text>
              </View>
            )}
          </View>
        }
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator color="#556B2F" style={{ marginVertical: 16 }} />
          ) : null
        }
      />

      {/* FAB for upload */}
      {!isReadOnly && (
        <Pressable
          onPress={() => setUploadVisible(true)}
          style={{
            position: "absolute",
            bottom: insets.bottom + 90,
            right: 20,
            width: 52,
            height: 52,
            borderRadius: 26,
            backgroundColor: "#3b4a2e",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 6,
            elevation: 6,
          }}
        >
          <Plus size={24} color="#fff" />
        </Pressable>
      )}

      <DocumentUploadModal
        visible={uploadVisible}
        departments={departments}
        onClose={() => setUploadVisible(false)}
        onSuccess={() => {
          refresh();
          showToast("Tải lên thành công!");
        }}
        onError={showToast}
      />

      {toast && (
        <View style={[s.toast, { bottom: insets.bottom + 24 }]}>
          <Text style={s.toastText}>{toast}</Text>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: "#fff",
  },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#111827" },
  headerSub: { fontSize: 12, color: "#9ca3af", marginTop: 2 },
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#556B2F",
    alignItems: "center",
    justifyContent: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  searchInput: { flex: 1, fontSize: 15, color: "#111827" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: "#374151" },
  clearText: { fontSize: 13, color: "#556B2F", fontWeight: "600" },
  center: { paddingVertical: 40, alignItems: "center" },
  emptyWrap: { alignItems: "center", paddingVertical: 48, gap: 12 },
  emptyText: { fontSize: 14, color: "#9ca3af", textAlign: "center" },
  fab: {
    position: "absolute",
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#556B2F",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  toast: {
    position: "absolute",
    left: 24,
    right: 24,
    backgroundColor: "#1f2937",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  toastText: { color: "#fff", fontSize: 14, fontWeight: "500" },
});
