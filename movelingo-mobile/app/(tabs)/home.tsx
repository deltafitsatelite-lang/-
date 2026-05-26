import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { roadmapSection } from '@/data/roadmap';
import { RoadmapNode } from '@/components/RoadmapNode';
import { useProgress } from '@/context/ProgressContext';
import { RoadmapNodeStatus } from '@/types/roadmap';

function resolveStatuses(completedLessonIds: string[]): RoadmapNodeStatus[] {
  const completedSet = new Set(completedLessonIds);
  const statuses: RoadmapNodeStatus[] = roadmapSection.nodes.map(() => 'locked');

  let firstUncompletedIndex = 0;
  for (let i = 0; i < roadmapSection.nodes.length; i += 1) {
    const node = roadmapSection.nodes[i];
    if (completedSet.has(node.lessonId)) {
      statuses[i] = 'completed';
      firstUncompletedIndex = i + 1;
    } else {
      break;
    }
  }

  if (firstUncompletedIndex < roadmapSection.nodes.length) {
    const node = roadmapSection.nodes[firstUncompletedIndex];
    if (node.kind === 'chest') statuses[firstUncompletedIndex] = 'chest';
    else if (node.kind === 'recovery') statuses[firstUncompletedIndex] = 'recovery';
    else statuses[firstUncompletedIndex] = 'current';
  }

  return statuses;
}

export default function HomeScreen() {
  const { progress } = useProgress();
  const statuses = resolveStatuses(progress.completedLessonIds);

  return (
    <View style={styles.screen}>
      <View style={styles.topStats}>
        <Text style={styles.stat}>🔥 {progress.streakDays}</Text>
        <Text style={styles.stat}>⚡ 1</Text>
        <Text style={styles.stat}>💎 {progress.totalXp}</Text>
        <Text style={styles.stat}>💚 25</Text>
      </View>

      <View style={styles.sectionCard}>
        <View>
          <Text style={styles.sectionTitle}>{roadmapSection.title}</Text>
          <Text style={styles.sectionSubtitle}>{roadmapSection.subtitle}</Text>
        </View>
        <Text style={styles.sectionIcon}>≡</Text>
      </View>

      <ScrollView contentContainerStyle={styles.roadmap} showsVerticalScrollIndicator={false}>
        {roadmapSection.nodes.map((node, idx) => {
          const status = statuses[idx];
          const canOpen = status === 'current' || status === 'completed' || status === 'chest' || status === 'recovery';
          return (
            <View key={node.id} style={{ alignItems: idx % 2 === 0 ? 'center' : 'flex-end', width: '100%' }}>
              <RoadmapNode
                node={node}
                status={status}
                onPress={() => {
                  if (canOpen) {
                    router.push(`/lesson/${node.lessonId}`);
                    return;
                  }
                  Alert.alert('ロック中', 'このレッスンはまだロックされています');
                }}
              />
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.bottomNav}>
        <Text style={[styles.navItem, styles.active]}>ホーム</Text>
        <Text style={styles.navItem}>トレーニング</Text>
        <Text style={styles.navItem}>実績</Text>
        <Text style={styles.navItem}>コーチ</Text>
        <Text style={styles.navItem}>プロフィール</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0F172A', paddingTop: 52, paddingHorizontal: 16 },
  topStats: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, backgroundColor: '#1E293B', borderRadius: 16, paddingVertical: 10, paddingHorizontal: 14 },
  stat: { color: '#E2E8F0', fontSize: 14, fontWeight: '700' },
  sectionCard: { backgroundColor: '#22C55E', borderRadius: 18, padding: 16, marginBottom: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { color: '#052E16', fontSize: 18, fontWeight: '800' },
  sectionSubtitle: { color: '#14532D', marginTop: 4, fontSize: 14, fontWeight: '600' },
  sectionIcon: { color: '#14532D', fontSize: 22, fontWeight: '800' },
  roadmap: { paddingBottom: 90, alignItems: 'center' },
  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#1E293B', flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#334155' },
  navItem: { color: '#94A3B8', fontSize: 11, fontWeight: '700' },
  active: { color: '#22C55E' },
});
