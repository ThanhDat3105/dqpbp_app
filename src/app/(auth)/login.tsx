import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
} from "lucide-react-native";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { z } from "zod";

import { useAuth } from "@/context/AuthContext";

const loginSchema = z.object({
  email: z.string().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

type FormErrors = { email?: string; password?: string };

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (field: "email" | "password", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validateForm = () => {
    try {
      loginSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: FormErrors = {};
        error.issues.forEach((err) => {
          const field = err.path[0] as keyof FormErrors;
          fieldErrors[field] = err.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const ok = await login(formData.email, formData.password);
      if (ok) router.replace("/(app)/performance");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#3b4a2e]"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerClassName="flex-1"
        keyboardShouldPersistTaps="handled"
      >
        <View className="items-center gap-3 px-6 pb-16 pt-20">
          <View className="items-center justify-center">
            <Image
              source={require("@/assets/images/logo-dqtv.png")}
              style={{ width: 160, height: 160 }}
              contentFit="contain"
            />
          </View>
          <Text className="text-center text-3xl font-bold text-white">
            Hệ thống Quản lý DQTV
          </Text>
          <Text className="text-center text-lg text-white/70">
            Ban Chỉ huy Quân sự{"\n"}Phường Bình Phú
          </Text>
        </View>

        <View className="-mt-10 flex-1 rounded-t-3xl bg-white px-6 pb-8 pt-8">
          <Text className="text-2xl font-bold text-[#3b4a2e]">Đăng nhập</Text>
          <Text className="mt-1 text-sm text-gray-500">
            Chúc bạn một ngày làm việc tốt lành
          </Text>

          <View className="mt-6 gap-5">
            <View>
              <Text className="mb-1 text-base font-medium text-gray-700">
                Email / Tài khoản
              </Text>
              <View className="relative">
                <View className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Mail size={18} color="#9ca3af" />
                </View>
                <TextInput
                  placeholder="Nhập email của bạn"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={formData.email}
                  onChangeText={(v) => handleChange("email", v)}
                  className={`w-full rounded-xl border bg-gray-50 px-3 py-3 text-base ${
                    errors.email ? "border-red-500" : "border-gray-200"
                  }`}
                />
              </View>
              {errors.email ? (
                <Text className="mt-1 text-xs text-red-500">
                  {errors.email}
                </Text>
              ) : null}
            </View>

            <View>
              <Text className="mb-1 text-base font-medium text-gray-700">
                Mật khẩu
              </Text>
              <View className="relative">
                <View className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Lock size={18} color="#9ca3af" />
                </View>
                <TextInput
                  placeholder="Nhập mật khẩu của bạn"
                  secureTextEntry={!showPassword}
                  value={formData.password}
                  onChangeText={(v) => handleChange("password", v)}
                  className={`w-full rounded-xl border bg-gray-50 px-3 py-3 pr-10 text-base ${
                    errors.password ? "border-red-500" : "border-gray-200"
                  }`}
                />
                <Pressable
                  onPress={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOff size={18} color="#9ca3af" />
                  ) : (
                    <Eye size={18} color="#9ca3af" />
                  )}
                </Pressable>
              </View>
              {errors.password ? (
                <Text className="mt-1 text-xs text-red-500">
                  {errors.password}
                </Text>
              ) : null}
            </View>

            <View className="flex-row items-center justify-between">
              <Pressable
                onPress={() => setRememberMe((prev) => !prev)}
                className="flex-row items-center gap-2"
              >
                <View
                  className={`h-5 w-5 items-center justify-center rounded border ${
                    rememberMe
                      ? "border-[#3b4a2e] bg-[#3b4a2e]"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {rememberMe ? <Check size={14} color="#ffffff" /> : null}
                </View>
                <Text className="text-sm text-gray-600">Ghi nhớ đăng nhập</Text>
              </Pressable>

              <Pressable>
                <Text className="text-sm font-medium text-[#3b4a2e]">
                  Quên mật khẩu?
                </Text>
              </Pressable>
            </View>

            <Pressable
              onPress={handleSubmit}
              disabled={loading}
              className="mt-2 w-full flex-row items-center justify-center gap-2 rounded-xl bg-[#3b4a2e] py-3.5 active:bg-[#2e3a24]"
            >
              <Text className="font-semibold text-white">
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Text>
              {!loading ? <ArrowRight size={18} color="#ffffff" /> : null}
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
