import { useState } from "react";
import { Pressable, View } from "react-native";

import { ActivityListTab } from "@/components/activities/activity-list-tab";
import { CalendarTab } from "@/components/calendar/calendar-tab";
import { ScheduleTab } from "@/components/schedule/schedule-tab";
import { ThemedText } from "@/components/themed-text";

const TABS = [
  { key: "tasks", label: "Nhiệm vụ" },
  { key: "calendar", label: "Lịch công tác" },
  { key: "duty", label: "Trực tuần" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function InnerTabBar({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (k: TabKey) => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
        paddingHorizontal: 16,
      }}
    >
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        return (
          <Pressable
            key={tab.key}
            onPress={() => onChange(tab.key)}
            style={{
              flex: 1,
              alignItems: "center",
              paddingVertical: 11,
              borderBottomWidth: 2,
              borderBottomColor: isActive ? "#3b4a2e" : "transparent",
            }}
          >
            <ThemedText
              style={{
                fontSize: 13,
                fontWeight: isActive ? "700" : "500",
                color: isActive ? "#3b4a2e" : "#6b7280",
              }}
            >
              {tab.label}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function ActivitiesScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>("tasks");

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <InnerTabBar active={activeTab} onChange={setActiveTab} />

      {activeTab === "tasks" && <ActivityListTab />}
      {activeTab === "calendar" && <CalendarTab />}
      {activeTab === "duty" && <ScheduleTab />}
    </View>
  );
}
