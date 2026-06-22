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
import { useYouthActions } from "@/components/youth/use-youth-actions";
import { useYouthList } from "@/components/youth/use-youth-list";
import { YouthConfirmDialog } from "@/components/youth/youth-confirm-dialog";
import { YouthDetailSheet } from "@/components/youth/youth-detail-sheet";
import { YouthFormModal } from "@/components/youth/youth-form-modal";
import { YouthListItem } from "@/components/youth/youth-list-item";
import { FilterValue } from "@/components/youth/youth-screen-filters";
import {
  YouthFilterChips,
  YouthScreenHeader,
  YouthSearchToolbar,
} from "@/components/youth/youth-screen-header";
import { useAuth } from "@/context/AuthContext";

export function YouthPersonnelTab() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const isReadOnly = user?.role === "DQCD";

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterValue>("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const {
    rows,
    total,
    loading,
    loadingMore,
    loadMore,
    refresh,
    debouncedSearch,
  } = useYouthList(filter, search);

  const actions = useYouthActions({ refresh, showToast });

  return (
    <View style={s.screen}>
      <YouthScreenHeader
        total={total}
        isReadOnly={isReadOnly}
        onAdd={actions.openCreate}
      />
      <YouthSearchToolbar
        search={search}
        onSearchChange={setSearch}
        filterOpen={filterOpen}
        onToggleFilter={() => setFilterOpen((p) => !p)}
      />
      {filterOpen && (
        <YouthFilterChips
          filter={filter}
          onSelect={(f) => {
            setFilter(f);
            setFilterOpen(false);
          }}
        />
      )}

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
            <YouthListItem
              item={item}
              isReadOnly={isReadOnly}
              onView={() => actions.setDetailId(item.id)}
              onEdit={() => actions.openEdit(item)}
              onDelete={() => actions.setDeleteTarget(item)}
              onPromote={() => actions.setPromoteTarget(item)}
            />
          )}
          ListEmptyComponent={
            <View style={s.empty}>
              <ThemedText style={s.emptyText}>
                {debouncedSearch || filter !== "all"
                  ? "Không tìm thấy hồ sơ nào khớp"
                  : "Chưa có hồ sơ nhân sự tuổi 17"}
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

      <YouthDetailSheet
        id={actions.detailId}
        onClose={() => actions.setDetailId(null)}
      />

      <YouthFormModal
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

      <YouthConfirmDialog
        visible={!!actions.promoteTarget}
        title="Chuyển thành Nguồn"
        message={`Chuyển hồ sơ của ${actions.promoteTarget?.full_name} sang danh sách Nguồn? Hồ sơ sẽ được xóa khỏi danh sách Tuổi 17.`}
        confirmLabel="Xác nhận"
        confirmColor="#16a34a"
        loading={actions.promoteLoading}
        onCancel={() => actions.setPromoteTarget(null)}
        onConfirm={actions.confirmPromote}
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
