import { ScrollView, View } from "react-native";

import { ForceView } from "@/components/performance/force-view";
import { KpiView } from "@/components/performance/kpi-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PerformanceScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: "#f9fafb" }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        <ForceView />
        <KpiView />
      </ScrollView>
    </View>
  );
}
