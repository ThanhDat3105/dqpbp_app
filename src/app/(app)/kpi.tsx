import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useAuth } from "@/context/AuthContext";

export default function KpiPage() {
  const { user } = useAuth();

  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <ThemedText type="title">Quản lý KPI</ThemedText>
        <ThemedText>{`Xin chào, ${user?.name ?? ""}`}</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: { flex: 1, padding: 24, gap: 8 },
});
