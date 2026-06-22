import { useState } from "react";
import { YouthPersonnel, YouthPersonnelDetail, youthApi } from "@/services/api/youth";

interface UseYouthActionsProps {
  refresh: () => void;
  showToast: (msg: string) => void;
}

export function useYouthActions({ refresh, showToast }: UseYouthActionsProps) {
  const [detailId, setDetailId] = useState<number | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [formInitial, setFormInitial] = useState<YouthPersonnelDetail | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<YouthPersonnel | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [promoteTarget, setPromoteTarget] = useState<YouthPersonnel | null>(null);
  const [promoteLoading, setPromoteLoading] = useState(false);

  const openCreate = () => {
    setFormMode("create");
    setFormInitial(null);
    setFormVisible(true);
  };

  const openEdit = async (row: YouthPersonnel) => {
    try {
      const detail = await youthApi.getById(row.id);
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
      await youthApi.remove(deleteTarget.id);
      showToast(`Đã xóa hồ sơ ${deleteTarget.full_name}`);
      setDeleteTarget(null);
      refresh();
    } catch (e: any) {
      showToast(e?.data?.message ?? "Xóa hồ sơ thất bại");
    } finally {
      setDeleteLoading(false);
    }
  };

  const confirmPromote = async () => {
    if (!promoteTarget) return;
    setPromoteLoading(true);
    try {
      await youthApi.promoteToNguon(promoteTarget.id);
      showToast(`Đã chuyển ${promoteTarget.full_name} thành Nguồn`);
      setPromoteTarget(null);
      refresh();
    } catch (e: any) {
      showToast(e?.data?.message ?? "Chuyển thất bại");
    } finally {
      setPromoteLoading(false);
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
    promoteTarget, setPromoteTarget, promoteLoading,
    openCreate, openEdit, confirmDelete, confirmPromote, onFormSuccess,
  };
}
