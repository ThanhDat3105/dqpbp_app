import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useRouter } from "expo-router";
import {
  BarChart3,
  CalendarCheck2,
  FileText,
  LogOut,
  Users,
} from "lucide-react-native";
import { Alert, Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/context/AuthContext";

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
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Đăng xuất", "Bạn có chắc chắn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  return (
    <View
      className="absolute bottom-0 left-0 right-0 flex-row items-center justify-around border-t border-gray-200 bg-white px-2 pt-2"
      style={{ paddingBottom: insets.bottom + 8 }}
    >
      {state.routes.map((route, index) => {
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
            className={`flex items-center gap-1.5 rounded-full px-3 pt-2`}
          >
            <Icon size={24} color={isFocused ? ACTIVE_COLOR : "#9ca3af"} />
            <ThemedText
              style={{
                color: isFocused ? ACTIVE_COLOR : "#9ca3af",
                fontSize: 14,
              }}
            >
              {label}
            </ThemedText>
          </Pressable>
        );
      })}

      <Pressable
        onPress={handleLogout}
        className="flex items-center gap-1.5 rounded-full px-3 pt-2"
      >
        <LogOut size={24} color="#ef4444" />
        <ThemedText style={{ color: "#ef4444", fontSize: 14 }}>
          Đăng xuất
        </ThemedText>
      </Pressable>
    </View>
  );
}
