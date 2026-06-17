import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Image } from "expo-image";
import {
  BarChart3,
  CalendarCheck2,
  FileText,
  Users,
} from "lucide-react-native";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";

const TAB_ICONS: Record<string, typeof BarChart3> = {
  performance: BarChart3,
  activities: CalendarCheck2,
  personnel: Users,
  documents: FileText,
};

const ACTIVE_COLOR = "#556B2F";

export function AppBottomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const half = Math.floor(state.routes.length / 2);

  const renderTab = (route: (typeof state.routes)[0], index: number) => {
    const { options } = descriptors[route.key];
    const label = (options.title ?? route.name) as string;
    const isFocused = state.index === index;
    const Icon = TAB_ICONS[route.name] ?? CalendarCheck2;

    const onPress = () => {
      const event = navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });
      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name);
      }
    };

    return (
      <Pressable
        key={route.key}
        onPress={onPress}
        className="flex-1 items-center gap-1.5 pt-2"
      >
        <Icon size={24} color={isFocused ? ACTIVE_COLOR : "#9ca3af"} />
        <ThemedText
          style={{ color: isFocused ? ACTIVE_COLOR : "#9ca3af", fontSize: 11 }}
        >
          {label}
        </ThemedText>
      </Pressable>
    );
  };

  return (
    <View
      className="absolute bottom-0 left-0 right-0 border-t border-gray-200 bg-white"
      style={{ paddingBottom: 20 }}
    >
      <View className="flex-row items-center pt-2">
        {state.routes.slice(0, half).map((route, i) => renderTab(route, i))}

        <View className="w-20 items-center">
          <View
            className="h-20 w-20 items-center justify-center rounded-full bg-[#3b4a2e]"
            style={{ marginTop: -28 }}
          >
            <Image
              source={require("@/assets/images/logo-dqtv.png")}
              style={{ width: 52, height: 52 }}
              contentFit="contain"
            />
          </View>
        </View>

        {state.routes.slice(half).map((route, i) => renderTab(route, half + i))}
      </View>
    </View>
  );
}
