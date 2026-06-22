import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { YouthConfirmDialog } from "@/components/youth/youth-confirm-dialog";
import { useAuth } from "@/context/AuthContext";

import { QndbDetailSheet } from "./qndb-detail-sheet";
import { QndbFormModal } from "./qndb-form-modal";
import { QndbListItem } from "./qndb-list-item";
import { QndbScreenHeader, QndbSearchToolbar } from "./qndb-screen-header";
import { useQndbActions } from "./use-qndb-actions";
import { useQndbList } from "./use-qndb-list";

export default function QndbPersonnelTab() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const isReadOnly = user?.role === "DQCD";

  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    if (ToastAndroid?.show) {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    } else {
      setToast(msg);
      setTimeout(() => setToast(null), 2500);
    }
  };

  const { rows, total, loading, loadingMore, loadMore, refresh, debouncedSearch } =
    useQndbList(search);

  const {
    detailId, setDetailId,
    formVisible, setFormVisible,
    formMode, formInitial,
    deleteTarget, setDeleteTarget, deleteLoading,
    openCreate, openEdit, confirmDelete, onFormSuccess,
  } = useQndbActions({ refresh, showToast });

  const isEmpty = !loading && rows.length === 0;

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <QndbScreenHeader total={total} isReadOnly={isReadOnly} onAdd={openCreate} />
      <QndbSearchToolbar search={search} onSearchChange={setSearch} />

      {loading && rows.length === 0 ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color="#556B2F" />
        </View>
      ) : isEmpty ? (
        <View style={s.center}>
          <Text style={s.emptyText}>
            {debouncedSearch
              ? "Không tìm thấy hồ sơ nào khớp với từ khóa"
              : "Chưa có hồ sơ quân nhân dự bị nào"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={rows}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <QndbListItem
              item={item}
              isReadOnly={isReadOnly}
              onView={() => setDetailId(item.id)}
              onEdit={() => openEdit(item)}
              onDelete={() => setDeleteTarget(item)}
            />
          )}
          contentContainerStyle={[s.list, { paddingBottom: insets.bottom + 16 }]}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            loadingMore ? <ActivityIndicator color="#556B2F" style={{ marginVertical: 12 }} /> : null
          }
        />
      )}

      <QndbDetailSheet id={detailId} onClose={() => setDetailId(null)} />

      <QndbFormModal
        visible={formVisible}
        mode={formMode}
        initial={formInitial}
        onClose={() => setFormVisible(false)}
        onSuccess={() => onFormSuccess(formMode)}
        onError={showToast}
      />

      <YouthConfirmDialog
        visible={!!deleteTarget}
        title="Xóa hồ sơ"
        message={`Bạn có chắc muốn xóa hồ sơ của ${deleteTarget?.full_name ?? ""}? Hành động này không thể hoàn tác.`}
        confirmLabel="Xóa hồ sơ"
        confirmColor="#ef4444"
        loading={deleteLoading}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {toast && (
        <View style={s.toast}>
          <Text style={s.toastText}>{toast}</Text>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  emptyText: { fontSize: 14, color: "#9ca3af", textAlign: "center", paddingHorizontal: 32 },
  list: { padding: 16 },
  toast: { position: "absolute", bottom: 32, left: 24, right: 24, backgroundColor: "#1f2937", borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, alignItems: "center" },
  toastText: { color: "#fff", fontSize: 14, fontWeight: "500" },
});
