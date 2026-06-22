import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { YouthPersonnelTab } from "@/components/youth/youth-personnel-tab";

export default function YouthPersonnelScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <YouthPersonnelTab />
    </View>
  );
}
