import { Alert, ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BottomNav } from '@/components/BottomNav';
import { router } from 'expo-router';
import { useUserProfile } from '@/context/UserProfileContext';
import { useProgress } from '@/context/ProgressContext';
import { PulseNode } from '@/components/PulseNode';
import { roadmapNodes } from '@/data/roadmap';
import { RoadmapNodeStatus } from '@/types/roadmap';

function buildNodeStatuses(completedLessonIds: string[]): Record<string, RoadmapNodeStatus> {
  const actionableNodes = roadmapNodes.filter((node) => node.type !== 'bonus');

  const firstUncompletedActionableIndex = actionableNodes.findIndex(
    (node) => !completedLessonIds.includes(node.lessonId),
  );

  const statuses: Record<string, RoadmapNodeStatus> = {};

  roadmapNodes.forEach((node) => {
    if (node.type === 'bonus') {
      statuses[node.id] = 'bonus';
      return;
    }

    if (completedLessonIds.includes(node.lessonId)) {
      statuses[node.id] = 'completed';
      return;
    }

    const actionableIndex = actionableNodes.findIndex((item) => item.id === node.id);
    if (actionableIndex === -1) {
      statuses[node.id] = node.status;
      return;
    }

    if (firstUncompletedActionableIndex === -1) {
      statuses[node.id] = 'locked';
      return;
    }

    statuses[node.id] = actionableIndex === firstUncompletedActionableIndex ? 'current' : 'locked';
  });

  return statuses;
}

export default function IndexScreen() {
  const { onboardingCompleted, isLoadingProfile } = useUserProfile();
  const { isLoadingProgress, progress } = useProgress();

  if (isLoadingProfile || isLoadingProgress) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color="#5EEAD4" />
      </View>
    );
  }

  if (!onboardingCompleted) {
    router.replace('/onboarding');
    return null;
  }

  const statuses = buildNodeStatuses(progress.completedLessonIds);

  return (
    <View style={styles.screen}>
      <View style={styles.statusPanel}>
        <View style={styles.statPill}><Text style={styles.statLabel}>継続日数 {progress.streakDays}</Text></View>
        <View style={styles.statPill}><Text style={styles.statLabel}>{progress.recoveryMode ? '復帰モード' : '今日のリズム 1'}</Text></View>
        <View style={styles.statPill}><Text style={styles.statLabel}>MP {progress.totalXp}</Text></View>
        <View style={styles.statPill}><Text style={styles.statLabel}>エネルギー {progress.energy}</Text></View>
      </View>

      <View style={styles.phaseCard}>
        <Text style={styles.phaseTitle}>Phase 1</Text>
        <Text style={styles.phaseSub}>3分の運動習慣をつくる</Text>
        <Text style={styles.phaseNote}>下半身・体幹・呼吸の基礎</Text>
      </View>

      <ScrollView contentContainerStyle={styles.trail} showsVerticalScrollIndicator={false}>
        {roadmapNodes.map((node, idx) => {
          const nodeStatus = statuses[node.id] ?? node.status;
          return (
            <View key={node.id} style={{ alignItems: idx % 2 === 0 ? 'flex-start' : 'flex-end', width: '100%' }}>
              <PulseNode
                title={node.title}
                caption={node.caption}
                state={nodeStatus}
                onPress={() => {
                  if (nodeStatus === 'current' || nodeStatus === 'completed' || nodeStatus === 'recovery') {
                    router.push(`/lesson/${node.lessonId}`);
                    return;
                  }
                  if (nodeStatus === 'bonus') {
                    Alert.alert('成長ボーナス', 'ボーナスはもう少しで解放されます');
                    return;
                  }
                  Alert.alert('ロック中', '前のレッスンを完了すると解放されます');
                }}
              />
            </View>
          );
        })}
      </ScrollView>

      <BottomNav />

    </View>
  );
}

const styles = StyleSheet.create({
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#06271F' },
  screen: { flex: 1, backgroundColor: '#06271F', paddingTop: 48, paddingHorizontal: 14 },
  statusPanel: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  statPill: { backgroundColor: '#0F3A32', borderRadius: 999, paddingVertical: 7, paddingHorizontal: 12 },
  statLabel: { color: '#D1FAE5', fontSize: 12, fontWeight: '700' },
  phaseCard: { backgroundColor: '#E6FFFA', borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#99F6E4' },
  phaseTitle: { color: '#115E59', fontSize: 18, fontWeight: '800' },
  phaseSub: { color: '#0F766E', marginTop: 4, fontSize: 14, fontWeight: '700' },
  phaseNote: { color: '#1E3A8A', marginTop: 4, fontSize: 12, fontWeight: '600' },
  trail: { paddingBottom: 84 },
});
