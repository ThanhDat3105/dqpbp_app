import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { User as UserIcon } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/context/AuthContext";
import { Image } from "expo-image";

export function AppHeader() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user } = useAuth();

  return (
    <LinearGradient
      colors={["#7a9a4a", "#4d6b35"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{
        paddingTop: insets.top + 8,
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingBottom: 16,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
      className="px-4 pb-4"
    >
      <View className="flex-row items-center justify-center gap-3">
        <Image
          source={require("@/assets/images/logo-dqtv.png")}
          style={{ width: 40, height: 40 }}
          contentFit="contain"
        />

        <View>
          <ThemedText
            style={{ color: "#ffffff", fontSize: 16, fontWeight: "bold" }}
          >
            QUÂN SỰ QUỐC PHÒNG
          </ThemedText>
          <ThemedText
            style={{ color: "#ffffff", fontSize: 12, lineHeight: 14 }}
          >
            Ban CHQS Phường Bình Phú
          </ThemedText>
        </View>
      </View>

      <Pressable
        onPress={() => router.push("/account-pages/account")}
        className="relative h-10 w-10 items-center justify-center rounded-full bg-white/15"
      >
        <UserIcon size={20} color="#ffffff" />
        <View className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-amber-400" />
      </Pressable>
    </LinearGradient>
  );
}
