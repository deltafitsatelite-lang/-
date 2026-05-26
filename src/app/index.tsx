import React from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';

type NodeStatus = 'completed' | 'current' | 'locked' | 'chest' | 'recovery';

const nodes: { id: string; status: NodeStatus; label: string }[] = [
  { id: 'warmup', status: 'completed', label: '★' },
  { id: 'chair-squat', status: 'current', label: '★' },
  { id: 'chest-1', status: 'chest', label: '🎁' },
  { id: 'recovery-1', status: 'recovery', label: '☘' },
  { id: 'wall-pushup', status: 'locked', label: '🔒' },
  { id: 'core-breathing', status: 'locked', label: '🔒' },
];

export default function Home() {
  const router = useRouter();

  const handleNodePress = (status: NodeStatus) => {
    if (status === 'locked') {
      Alert.alert('まだロック中です', '前のレッスンを完了すると解放されます。');
      return;
    }

    if (status === 'chest') {
      Alert.alert('宝箱', 'もう少し進むと報酬が開きます。');
      return;
    }

    router.push('/lesson/chair-squat');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.statusBar}>
        <Text style={styles.statusItem}>🔥 7</Text>
        <Text style={styles.statusItem}>⚡ 1</Text>
        <Text style={styles.statusItem}>💎 525</Text>
        <Text style={styles.statusItem}>💗 25</Text>
      </View>

      <View style={styles.sectionCard}>
        <View>
          <Text style={styles.sectionSmall}>セクション1・ユニット1</Text>
          <Text style={styles.sectionTitle}>まずは3分の運動習慣</Text>
        </View>
        <Text style={styles.sectionIcon}>☰</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.roadmap}
        showsVerticalScrollIndicator={false}
      >
        {nodes.map((node, index) => {
          const isLeft = index % 2 === 1;

          return (
            <View
              key={node.id}
              style={[
                styles.nodeRow,
                isLeft ? styles.nodeRowLeft : styles.nodeRowRight,
              ]}
            >
              <Pressable
                onPress={() => handleNodePress(node.status)}
                style={({ pressed }) => [
                  styles.node,
                  node.status === 'completed' && styles.completedNode,
                  node.status === 'current' && styles.currentNode,
                  node.status === 'locked' && styles.lockedNode,
                  node.status === 'chest' && styles.chestNode,
                  node.status === 'recovery' && styles.recoveryNode,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.nodeText}>{node.label}</Text>
              </Pressable>

              {node.status === 'current' ? (
                <View style={styles.currentBubble}>
                  <Text style={styles.currentBubbleText}>今日</Text>
                </View>
              ) : null}
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.bottomTabs}>
        <Text style={styles.activeTab}>🏠</Text>
        <Text style={styles.tab}>💪</Text>
        <Text style={styles.tab}>🏆</Text>
        <Text style={styles.tab}>💬</Text>
        <Text style={styles.tab}>👤</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#101C20',
    paddingTop: 42,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    marginBottom: 18,
  },
  statusItem: {
    color: '#F6F8F7',
    fontSize: 18,
    fontWeight: '800',
  },
  sectionCard: {
    marginHorizontal: 20,
    backgroundColor: '#58CC02',
    borderRadius: 22,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionSmall: {
    color: '#EFFFF0',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 8,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
  },
  sectionIcon: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '900',
  },
  roadmap: {
    paddingTop: 28,
    paddingBottom: 120,
  },
  nodeRow: {
    width: '100%',
    marginVertical: 14,
    paddingHorizontal: 48,
  },
  nodeRowLeft: {
    alignItems: 'flex-start',
  },
  nodeRowRight: {
    alignItems: 'center',
  },
  node: {
    width: 86,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 6,
  },
  completedNode: {
    backgroundColor: '#58CC02',
    borderBottomWidth: 8,
    borderBottomColor: '#3FA000',
  },
  currentNode: {
    backgroundColor: '#7BE000',
    borderBottomWidth: 8,
    borderBottomColor: '#4BAA00',
    width: 96,
    height: 80,
    borderRadius: 40,
  },
  lockedNode: {
    backgroundColor: '#2D3A3F',
    borderBottomWidth: 8,
    borderBottomColor: '#1F292D',
  },
  chestNode: {
    backgroundColor: '#F6C343',
    borderBottomWidth: 8,
    borderBottomColor: '#B98600',
  },
  recoveryNode: {
    backgroundColor: '#66D8A8',
    borderBottomWidth: 8,
    borderBottomColor: '#2EA070',
  },
  nodeText: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '900',
  },
  currentBubble: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    marginTop: 8,
  },
  currentBubbleText: {
    color: '#58CC02',
    fontSize: 14,
    fontWeight: '900',
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.96 }],
  },
  bottomTabs: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 86,
    backgroundColor: '#14262C',
    borderTopWidth: 1,
    borderTopColor: '#2C3F46',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  activeTab: {
    fontSize: 30,
    backgroundColor: '#1E3A43',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
  },
  tab: {
    fontSize: 28,
    opacity: 0.82,
  },
});