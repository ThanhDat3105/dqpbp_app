import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
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
      if (ok) router.replace("/(app)/dashboard");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 items-center justify-center bg-[#556B2F] p-6"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerClassName="flex-1 w-full items-center justify-center"
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full max-w-md rounded-2xl bg-white/90 p-6">
          <View className="mb-6 flex-row items-center gap-3">
            <Image
              source={require("@/assets/images/logo-dqtv.png")}
              style={{ width: 40, height: 40 }}
              contentFit="contain"
            />
            <View>
              <Text className="text-2xl font-bold text-[#556B2F]">
                Đăng nhập
              </Text>
              <Text className="text-sm text-gray-500">
                Chúc bạn 1 ngày làm việc tốt lành
              </Text>
            </View>
          </View>

          <View className="gap-6">
            <View>
              <Text className="mb-1 text-sm font-medium">Email</Text>
              <TextInput
                placeholder="Nhập email của bạn"
                autoCapitalize="none"
                keyboardType="email-address"
                value={formData.email}
                onChangeText={(v) => handleChange("email", v)}
                className={`w-full rounded-lg border px-3 py-2 text-sm ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email ? (
                <Text className="mt-1 text-xs text-red-500">
                  {errors.email}
                </Text>
              ) : null}
            </View>

            <View>
              <Text className="mb-1 text-sm font-medium">Mật khẩu</Text>
              <View className="relative">
                <TextInput
                  placeholder="Nhập mật khẩu của bạn"
                  secureTextEntry={!showPassword}
                  value={formData.password}
                  onChangeText={(v) => handleChange("password", v)}
                  className={`w-full rounded-lg border px-3 py-2 pr-10 text-sm ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <Pressable
                  onPress={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
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

            <Pressable
              onPress={handleSubmit}
              disabled={loading}
              className="w-full items-center rounded-lg bg-[#556B2F] py-2 active:bg-[#455A1A]"
            >
              <Text className="font-semibold text-white">
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
