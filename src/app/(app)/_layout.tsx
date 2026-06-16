import { Tabs } from 'expo-router';

import { useRequireAuth } from '@/context/AuthContext';

export default function AppLayout() {
  const { isCheckingAuth } = useRequireAuth('/(auth)/login');

  if (isCheckingAuth) return null;

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="dashboard" options={{ title: 'Trang chủ' }} />
      <Tabs.Screen name="activities" options={{ title: 'Hoạt động' }} />
      <Tabs.Screen name="calendar" options={{ title: 'Lịch' }} />
      <Tabs.Screen name="profile" options={{ title: 'Cá nhân' }} />
    </Tabs>
  );
}
