import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/context/AuthContext';

export default function PerformanceScreen() {
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <ThemedText type="title">Hiệu suất</ThemedText>
      <ThemedText>Xin chào, {user?.name}</ThemedText>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 8 },
});
