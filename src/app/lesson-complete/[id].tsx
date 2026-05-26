import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function LessonComplete() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.emoji}>🎉</Text>
        <Text style={styles.title}>今日の一歩、完了！</Text>
        <Text style={styles.description}>
          3分でも、身体はちゃんと前に進んでいます。
        </Text>

        <View style={styles.rewardCard}>
          <Text style={styles.rewardLabel}>獲得XP</Text>
          <Text style={styles.rewardValue}>+10 XP</Text>
        </View>

        <View style={styles.rewardCard}>
          <Text style={styles.rewardLabel}>連続記録</Text>
          <Text style={styles.rewardValue}>3日</Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.replace('/')}
        >
          <Text style={styles.primaryButtonText}>ホームに戻る</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FBF7',
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 56,
    textAlign: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#17202A',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#34495E',
    textAlign: 'center',
    marginBottom: 24,
  },
  rewardCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
  },
  rewardLabel: {
    fontSize: 14,
    color: '#5D6D7E',
    marginBottom: 6,
  },
  rewardValue: {
    fontSize: 30,
    fontWeight: '800',
    color: '#22A45D',
  },
  primaryButton: {
    backgroundColor: '#22A45D',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 18,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.99 }],
  },
});