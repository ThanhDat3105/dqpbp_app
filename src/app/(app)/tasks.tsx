import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";

export default function TasksPage() {
  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <ThemedText type="title">Nhiệm vụ</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: { flex: 1, padding: 24 },
});
