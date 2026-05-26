import { StyleSheet, Text, View } from 'react-native';
import { BottomNav } from '@/components/BottomNav';

export default function TrainingScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.title}>レッスン</Text>
        <Text style={styles.body}>トレーニング画面（仮）</Text>
      </View>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#06271F', paddingTop: 56, paddingHorizontal: 16 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8, paddingBottom: 64 },
  title: { color: '#F0FDFA', fontSize: 24, fontWeight: '800' },
  body: { color: '#A7F3D0', fontSize: 14, fontWeight: '600' },
});
