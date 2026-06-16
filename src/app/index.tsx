import { Redirect } from 'expo-router';

import { useAuth } from '@/context/AuthContext';

export default function Index() {
  const { isLoadingFetchUser, isAuth } = useAuth();

  if (isLoadingFetchUser) return null;

  return <Redirect href={isAuth ? '/(app)/performance' : '/(auth)/login'} />;
}
