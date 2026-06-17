import { AppBottomTabBar } from "@/components/app-bottom-tab-bar";
import { AppHeader } from "@/components/app-header";
import { Tabs } from "expo-router";

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        header: () => <AppHeader />,
      }}
      tabBar={(props) => <AppBottomTabBar {...props} />}
    >
      <Tabs.Screen name="performance" options={{ title: "Hiệu suất" }} />
      <Tabs.Screen name="activities" options={{ title: "Công tác" }} />
      <Tabs.Screen name="personnel" options={{ title: "Thuộc diện" }} />
      <Tabs.Screen name="documents" options={{ title: "Tài liệu" }} />
      <Tabs.Screen
        name="calendar-week"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="kpi"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
