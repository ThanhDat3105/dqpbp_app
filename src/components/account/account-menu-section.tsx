import { ChevronRight, LucideIcon } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { ThemedText } from "@/components/themed-text";

export interface AccountMenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  onPress?: () => void;
}

interface AccountMenuSectionProps {
  title: string;
  items: AccountMenuItem[];
}

export function AccountMenuSection({ title, items }: AccountMenuSectionProps) {
  return (
    <View className="mt-6">
      <ThemedText className="mb-2 text-xs font-bold tracking-wide text-[#3b4a2e]">
        {title}
      </ThemedText>

      <View className="overflow-hidden rounded-xl border border-gray-100">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <Pressable
              key={item.id}
              onPress={item.onPress}
              className={`flex-row items-center gap-3 bg-white px-4 py-3.5 active:bg-gray-50 ${
                index !== items.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <Icon size={20} color="#3b4a2e" />
              <ThemedText className="flex-1 text-base text-gray-800">
                {item.label}
              </ThemedText>
              <ChevronRight size={18} color="#9ca3af" />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
