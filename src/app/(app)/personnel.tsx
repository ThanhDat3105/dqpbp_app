import { StyleSheet, View } from 'react-native';

import { AppHeader } from '@/components/app-header';
import { ThemedText } from '@/components/themed-text';

export default function PersonnelScreen() {
  return (
    <View style={styles.screen}>
      <AppHeader />
      <View style={styles.container}>
        <ThemedText type="title">Thuộc diện QL</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  container: { flex: 1, padding: 24 },
});
