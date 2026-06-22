import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { YouthConfirmDialog } from "@/components/youth/youth-confirm-dialog";
import { useAuth } from "@/context/AuthContext";

import { NguonDetailSheet } from "./nguon-detail-sheet";
import { NguonFormModal } from "./nguon-form-modal";
import { NguonListItem } from "./nguon-list-item";
import { useNguonActions } from "./use-nguon-actions";
import { useNguonList } from "./use-nguon-list";
import { NguonSearchToolbar, NguonScreenHeader } from "./nguon-screen-header";

export default function NguonPersonnelTab() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const isReadOnly = user?.role === "DQCD";

  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const { rows, total, loading, loadingMore, loadMore, refresh, debouncedSearch } =
    useNguonList(search);

  const actions = useNguonActions({ refresh, showToast });

  return (
    <View style={s.screen}>
      <NguonScreenHeader
        total={total}
        isReadOnly={isReadOnly}
        onAdd={actions.openCreate}
      />
      <NguonSearchToolbar
        search={search}
        onSearchChange={setSearch}
      />

      {loading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color="#556B2F" />
        </View>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: insets.bottom + 100,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <NguonListItem
              item={item}
              isReadOnly={isReadOnly}
              onView={() => actions.setDetailId(item.id)}
              onEdit={() => actions.openEdit(item)}
              onDelete={() => actions.setDeleteTarget(item)}
            />
          )}
          ListEmptyComponent={
            <View style={s.empty}>
              <ThemedText style={s.emptyText}>
                {debouncedSearch
                  ? "Không tìm thấy hồ sơ nào khớp"
                  : "Chưa có hồ sơ nguồn nào"}
              </ThemedText>
            </View>
          }
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator
                size="small"
                color="#556B2F"
                style={{ paddingVertical: 12 }}
              />
            ) : rows.length < total ? (
              <Pressable onPress={loadMore} style={s.loadMore}>
                <ThemedText style={s.loadMoreText}>Tải thêm</ThemedText>
              </Pressable>
            ) : null
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
        />
      )}

      {toast && (
        <View style={[s.toast, { bottom: insets.bottom + 100 }]}>
          <ThemedText style={s.toastText}>{toast}</ThemedText>
        </View>
      )}

      <NguonDetailSheet
        id={actions.detailId}
        onClose={() => actions.setDetailId(null)}
      />

      <NguonFormModal
        visible={actions.formVisible}
        mode={actions.formMode}
        initial={actions.formInitial}
        onClose={() => actions.setFormVisible(false)}
        onSuccess={() => actions.onFormSuccess(actions.formMode)}
        onError={showToast}
      />

      <YouthConfirmDialog
        visible={!!actions.deleteTarget}
        title="Xác nhận xóa hồ sơ"
        message={`Bạn có chắc muốn xóa hồ sơ của ${actions.deleteTarget?.full_name}? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa hồ sơ"
        confirmColor="#ef4444"
        loading={actions.deleteLoading}
        onCancel={() => actions.setDeleteTarget(null)}
        onConfirm={actions.confirmDelete}
      />
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f9fafb" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  empty: { alignItems: "center", paddingTop: 60 },
  emptyText: { fontSize: 14, color: "#9ca3af" },
  loadMore: { alignItems: "center", paddingVertical: 12 },
  loadMoreText: { fontSize: 13, fontWeight: "700", color: "#556B2F" },
  toast: {
    position: "absolute",
    left: 20,
    right: 20,
    backgroundColor: "#1f2937",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  toastText: { color: "#fff", fontSize: 14, fontWeight: "500" },
});
