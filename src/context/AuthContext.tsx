import { useRouter } from 'expo-router';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { getToken, removeToken, setToken as persistToken } from '@/lib/token-storage';
import { authApi, User } from '@/services/api/auth';
import { userApi } from '@/services/api/user';

interface AuthContextType {
  isLoadingFetchUser: boolean;
  isLoadingSubmit: boolean;
  isAuth: boolean;
  token: string | null;
  user: User | null;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoadingFetchUser: true,
  isLoadingSubmit: false,
  isAuth: false,
  token: null,
  user: null,
  error: null,
  login: async () => false,
  logout: async () => {},
  refreshUser: async () => {},
  setUser: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoadingFetchUser, setIsLoadingFetchUser] = useState(true);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedToken = await getToken('authToken');

        if (savedToken) {
          const userData = await userApi.getMe();

          if (userData) {
            setTokenState(savedToken);
            setUser(userData);
            setIsAuth(true);
          }
        }
      } catch (err) {
        console.error('Authentication initialization error:', err);
      } finally {
        setIsLoadingFetchUser(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoadingSubmit(true);
    setError(null);

    try {
      const data = await authApi.login(email, password);
      const {
        token: { access_token: newToken },
        user: userData,
      } = data.metaData;

      await persistToken('authToken', newToken);

      setTokenState(newToken);
      setUser(userData);
      setIsAuth(true);

      const response = await userApi.getMe();
      if (response) setUser(response);

      return true;
    } catch (err: any) {
      setError(err?.data?.message ?? 'Đăng nhập thất bại. Vui lòng thử lại.');
      return false;
    } finally {
      setIsLoadingSubmit(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore network errors on logout, still clear local session
    } finally {
      await removeToken('authToken');
      setTokenState(null);
      setUser(null);
      setIsAuth(false);
      setIsLoadingFetchUser(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) return;

    setIsLoadingFetchUser(true);
    try {
      const response = await userApi.getMe();
      if (response) setUser(response);
    } catch (err) {
      console.error('Error refreshing user:', err);
    } finally {
      setIsLoadingFetchUser(false);
    }
  }, [token]);

  const value = useMemo(
    () => ({
      isLoadingFetchUser,
      isLoadingSubmit,
      isAuth,
      token,
      user,
      error,
      login,
      logout,
      refreshUser,
      setUser,
    }),
    [isLoadingFetchUser, isLoadingSubmit, isAuth, token, user, error, login, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

export const useRequireAuth = (redirectPath = '/login') => {
  const auth = useAuth();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    if (!auth.isLoadingFetchUser) {
      setIsCheckingAuth(false);

      if (!auth.isAuth) {
        router.replace(redirectPath as any);
      }
    }
  }, [auth.isLoadingFetchUser, auth.isAuth, redirectPath, router]);

  return { ...auth, isCheckingAuth };
};
