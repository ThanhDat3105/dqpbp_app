import { axiosInstance } from "@/lib/axios.config";
import { User } from "@/services/api/auth";

export type UserStatus = "on_duty" | "training" | "on_leave" | "other";

export interface Users {
  position: string;
  id: number;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  role: string;
  is_active: boolean;
  unit_code: string | null;
  status: UserStatus;
  department_id: number;
  date_of_birth: string | null;
  enlistment_date: string | null;
  military_rank: string | null;
  avatar_url: string | null;
}

const getMe = async (): Promise<User> => {
  const res = await axiosInstance.get("/api/auth/me");
  return res.data.metaData;
};

const getUsers = async (params: {
  status?: string;
  role?: string;
  limit?: number;
  search?: string;
}): Promise<Users[]> => {
  const res = await axiosInstance.get("/api/users", { params });
  return res.data.data ?? [];
};

export const userApi = {
  getMe,
  getUsers,
};
