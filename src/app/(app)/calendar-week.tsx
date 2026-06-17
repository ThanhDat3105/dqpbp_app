import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";

export default function CalendarWeekScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.container}>
        <ThemedText type="title">Lịch trực tuần</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: { flex: 1, padding: 24 },
});
