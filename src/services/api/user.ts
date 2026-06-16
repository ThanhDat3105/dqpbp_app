import { axiosInstance } from '@/lib/axios.config';
import { User } from '@/services/api/auth';

const getMe = async (): Promise<User> => {
  const res = await axiosInstance.get('/api/auth/me');
  return res.data.metaData;
};

export const userApi = {
  getMe,
};
