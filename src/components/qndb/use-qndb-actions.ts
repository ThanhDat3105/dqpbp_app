import { useState } from "react";
import { QndbPersonnel, QndbPersonnelDetail, qndbApi } from "@/services/api/qndb";

interface Props {
  refresh: () => void;
  showToast: (msg: string) => void;
}

export function useQndbActions({ refresh, showToast }: Props) {
  const [detailId, setDetailId] = useState<number | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [formInitial, setFormInitial] = useState<QndbPersonnelDetail | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<QndbPersonnel | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const openCreate = () => {
    setFormMode("create");
    setFormInitial(null);
    setFormVisible(true);
  };

  const openEdit = async (row: QndbPersonnel) => {
    try {
      const detail = await qndbApi.getById(row.id);
      setFormInitial(detail);
      setFormMode("edit");
      setFormVisible(true);
    } catch {
      showToast("Không thể tải chi tiết hồ sơ");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await qndbApi.remove(deleteTarget.id);
      showToast(`Đã xóa hồ sơ ${deleteTarget.full_name}`);
      setDeleteTarget(null);
      refresh();
    } catch (e: any) {
      showToast(e?.data?.message ?? "Xóa hồ sơ thất bại");
    } finally {
      setDeleteLoading(false);
    }
  };

  const onFormSuccess = (mode: "create" | "edit") => {
    showToast(mode === "create" ? "Tạo hồ sơ thành công" : "Cập nhật thành công");
    refresh();
  };

  return {
    detailId, setDetailId,
    formVisible, setFormVisible,
    formMode, formInitial,
    deleteTarget, setDeleteTarget, deleteLoading,
    openCreate, openEdit, confirmDelete, onFormSuccess,
  };
}
