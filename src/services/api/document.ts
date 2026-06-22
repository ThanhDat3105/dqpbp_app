import { axiosInstance } from "@/lib/axios.config";

export interface DocumentItem {
  id: number;
  title: string;
  description: string | null;
  file_url: string;
  file_name: string;
  is_public: boolean;
  uploaded_by: number;
  department_id: number;
  department_code: string | null;
  department_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface DepartmentItem {
  id: number;
  code: string;
  name: string;
}

export interface FetchDocumentsParams {
  page?: number;
  limit?: number;
  search?: string;
  departmentId?: number | null;
}

export interface UploadDocumentPayload {
  title: string;
  description?: string;
  department_id?: number;
  is_public?: boolean;
}

const fetchList = async (params: FetchDocumentsParams): Promise<{ data: DocumentItem[]; total: number }> => {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.departmentId != null) query.set("departmentId", String(params.departmentId));

  const res = await axiosInstance.get(`/api/documents?${query.toString()}`);
  return res.data.metaData;
};

const fetchDepartments = async (): Promise<DepartmentItem[]> => {
  const res = await axiosInstance.get("/api/department");
  return res.data.data ?? [];
};

const upload = async (
  fileUri: string,
  fileName: string,
  mimeType: string,
  payload: UploadDocumentPayload,
): Promise<DocumentItem> => {
  const form = new FormData();
  form.append("file", { uri: fileUri, name: fileName, type: mimeType } as any);
  form.append("title", payload.title);
  if (payload.description) form.append("description", payload.description);
  if (payload.department_id != null) form.append("department_id", String(payload.department_id));
  if (payload.is_public != null) form.append("is_public", String(payload.is_public));

  const res = await axiosInstance.post("/api/documents/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.metaData;
};

export const documentApi = { fetchList, fetchDepartments, upload };
