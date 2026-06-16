import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';

export default function PersonnelScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ThemedText type="title">Thuộc diện QL</ThemedText>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
});
