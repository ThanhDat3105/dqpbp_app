import { useRouter } from "expo-router";
import {
  BarChart3,
  CalendarDays,
  ChevronLeft,
  ClipboardList,
  FileText,
  LogOut,
  User as UserIcon,
} from "lucide-react-native";
import { Alert, Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AccountMenuSection } from "@/components/account/account-menu-section";
import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/context/AuthContext";

const departmentMap: Record<string, string> = {
  administration_office: "Văn thư",
  advise: "Tham mưu",
  political_affairs: "Chính trị",
  logistics: "Hậu cần",
  mobilization_recruitment: "Động viên tuyển quân",
};

const getDepartmentLabel = (value?: string) =>
  departmentMap[value ?? ""] ?? "Không xác định";

export default function AccountScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, logout } = useAuth();

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
    <View className="flex-1 bg-white">
      <View
        className="bg-[#3b4a2e] px-4 pb-6 flex-col gap-4"
        style={{ paddingTop: insets.top + 12 }}
      >
        <View className="flex-row items-center">
          <Pressable onPress={() => router.back()} className="p-1">
            <ChevronLeft size={24} color="#ffffff" />
          </Pressable>
          <ThemedText
            style={{ color: "#ffffff", fontSize: 18, fontWeight: "bold" }}
            className="flex-1 text-center"
          >
            Tài khoản
          </ThemedText>
          <View className="w-6" />
        </View>

        <View className="flex-row items-center gap-4">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-white/15">
            <UserIcon size={32} color="#ffffff" />
          </View>
          <View className="flex flex-col gap-2">
            {user &&
              (user.military_rank ||
                user.role === "DQTT" ||
                user.role === "DQCD") && (
                <ThemedText
                  style={{ color: "#ffffff", fontSize: 14, lineHeight: 16 }}
                >
                  {user.military_rank ?? ""}
                  {user.role === "DQCD" ? ` - ${user.role}` : ""}
                </ThemedText>
              )}
            <ThemedText
              style={{
                color: "#ffffff",
                fontSize: 18,
                fontWeight: "bold",
                lineHeight: 18,
              }}
            >
              {user?.name ?? "Khách"}
            </ThemedText>
            {(user?.role === "CHI_HUY" || user?.role === "TO_TRUONG") && (
              <View
                className={`self-start rounded-full px-2 ${
                  user.role === "CHI_HUY" ? "bg-orange-100" : "bg-blue-100"
                }`}
              >
                <ThemedText
                  style={{
                    color: user.role === "CHI_HUY" ? "#c2410c" : "#1e3a8a",
                    fontSize: 12,
                  }}
                >
                  {user.position}
                </ThemedText>
              </View>
            )}
            {user?.role !== "CHI_HUY" && user?.department && (
              <View className="self-start rounded-full bg-white/20 px-2">
                <ThemedText style={{ color: "#ffffff", fontSize: 12 }}>
                  Tổ {getDepartmentLabel(user.department)}
                </ThemedText>
              </View>
            )}
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4" contentContainerClassName="pb-8">
        <AccountMenuSection
          title="QUẢN LÝ CÔNG VIỆC"
          items={[
            {
              id: "kpi",
              label: "Hiệu xuất làm việc",
              icon: BarChart3,
              onPress: () => router.push("/(app)/kpi"),
            },
            {
              id: "tasks",
              label: "Nhiệm vụ",
              icon: ClipboardList,
              onPress: () => router.push("/(app)/tasks"),
            },
            {
              id: "calendar",
              label: "Lịch công tác",
              icon: CalendarDays,
              onPress: () => router.push("/(app)/calendar"),
            },
            {
              id: "calendar-qdtt",
              label: "Lịch trực tuần",
              icon: FileText,
              onPress: () => router.push("/(app)/calendar-week"),
            },
          ]}
        />

        <AccountMenuSection
          title="THÔNG TIN - TÀI LIỆU"
          items={[
            {
              id: "documents",
              label: "Tài liệu QS-QP",
              icon: FileText,
              onPress: () => router.push("/(app)/documents"),
            },
          ]}
        />

        <Pressable
          onPress={handleLogout}
          className="mt-8 flex-row items-center justify-center gap-2 rounded-xl border border-red-500 py-3.5 active:bg-orange-50"
        >
          <LogOut size={18} color="#ef4444" />
          <ThemedText style={{ color: "#ef4444" }} className="font-semibold">
            Đăng xuất tài khoản
          </ThemedText>
        </Pressable>
      </ScrollView>
    </View>
  );
}
