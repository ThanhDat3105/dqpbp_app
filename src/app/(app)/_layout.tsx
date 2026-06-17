import { Tabs } from "expo-router";

import { AppBottomTabBar } from "@/components/app-bottom-tab-bar";

export default function AppLayout() {
  // const { isCheckingAuth } = useRequireAuth('/(auth)/login');

  // if (isCheckingAuth) return null;

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <AppBottomTabBar {...props} />}
    >
      <Tabs.Screen name="performance" options={{ title: "Hiệu suất" }} />
      <Tabs.Screen name="activities" options={{ title: "Công tác" }} />
      <Tabs.Screen name="personnel" options={{ title: "Thuộc diện" }} />
      <Tabs.Screen name="documents" options={{ title: "Tài liệu" }} />
      <Tabs.Screen
        name="account"
        options={{
          tabBarItemStyle: { display: "none" },
        }}
      />
    </Tabs>
  );
}
