import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function LessonDetail() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.eyebrow}>今日のレッスン</Text>
        <Text style={styles.title}>椅子スクワット入門</Text>
        <Text style={styles.description}>
          椅子を使って、下半身をやさしく動かす3分レッスンです。
        </Text>

        <View style={styles.warningCard}>
          <Text style={styles.warningText}>
            痛み、めまい、息苦しさがある場合はすぐに中止してください。
          </Text>
        </View>

        <View style={styles.exerciseCard}>
          <Text style={styles.exerciseNumber}>1</Text>
          <Text style={styles.exerciseTitle}>肩回し</Text>
          <Text style={styles.exerciseText}>30秒、ゆっくり肩を回します。</Text>
        </View>

        <View style={styles.exerciseCard}>
          <Text style={styles.exerciseNumber}>2</Text>
          <Text style={styles.exerciseTitle}>椅子スクワット</Text>
          <Text style={styles.exerciseText}>
            椅子に軽く座るように、5回だけゆっくり行います。
          </Text>
        </View>

        <View style={styles.exerciseCard}>
          <Text style={styles.exerciseNumber}>3</Text>
          <Text style={styles.exerciseTitle}>深呼吸</Text>
          <Text style={styles.exerciseText}>
            最後に30秒、呼吸を整えます。
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.push('/lesson-complete/chair-squat')}
        >
          <Text style={styles.primaryButtonText}>完了した</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.secondaryButtonText}>今日はやめる</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FBF7',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  eyebrow: {
    fontSize: 14,
    fontWeight: '700',
    color: '#22A45D',
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#17202A',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#34495E',
    marginBottom: 18,
  },
  warningCard: {
    backgroundColor: '#FFF5E6',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  warningText: {
    fontSize: 14,
    lineHeight: 21,
    color: '#7A4A00',
  },
  exerciseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 18,
    marginBottom: 12,
  },
  exerciseNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: '#22A45D',
    marginBottom: 6,
  },
  exerciseTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#17202A',
    marginBottom: 8,
  },
  exerciseText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#34495E',
  },
  primaryButton: {
    backgroundColor: '#22A45D',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 14,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  secondaryButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#5D6D7E',
    fontSize: 16,
    fontWeight: '700',
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.99 }],
  },
});