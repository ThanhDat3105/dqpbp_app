import { useState } from "react";
import { Pressable, View } from "react-native";

import NguonPersonnelTab from "@/components/nguon/nguon-personnel-tab";
import { ThemedText } from "@/components/themed-text";
import { YouthPersonnelTab } from "@/components/youth/youth-personnel-tab";

const TABS = [
  { key: "17tuoi", label: "Tuổi 17" },
  { key: "nguon", label: "Nguồn" },
  { key: "dqtt", label: "DQTT" },
  { key: "qndb", label: "Quân nhân DB" },
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
        paddingHorizontal: 8,
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
              borderBottomColor: isActive ? "#556B2F" : "transparent",
            }}
          >
            <ThemedText
              style={{
                fontSize: 12,
                fontWeight: isActive ? "700" : "500",
                color: isActive ? "#556B2F" : "#6b7280",
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

export default function PersonnelScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>("17tuoi");

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <InnerTabBar active={activeTab} onChange={setActiveTab} />

      {activeTab === "17tuoi" && <YouthPersonnelTab />}
      {activeTab === "nguon" && <NguonPersonnelTab />}
      {activeTab === "dqtt" && (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ThemedText style={{ color: "#9ca3af", fontSize: 14 }}>
            DQTT — đang phát triển
          </ThemedText>
        </View>
      )}
      {activeTab === "qndb" && (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ThemedText style={{ color: "#9ca3af", fontSize: 14 }}>
            Quân nhân dự bị — đang phát triển
          </ThemedText>
        </View>
      )}
    </View>
  );
}
