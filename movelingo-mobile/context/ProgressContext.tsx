import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { completeLesson, INITIAL_PROGRESS_STATE } from '@/lib/progress';
import { lessons } from '@/data/lessons';
import { CompleteLessonResult, ProgressState } from '@/types/progress';
import { loadProgress, saveProgress } from '@/lib/storage';

type ProgressContextValue = {
  progress: ProgressState;
  isLoadingProgress: boolean;
  completeLessonById: (lessonId: string, today?: string) => CompleteLessonResult | null;
  resetProgress: () => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

function isoDate(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function ProgressProvider({ children }: PropsWithChildren) {
  const [progress, setProgress] = useState<ProgressState>(INITIAL_PROGRESS_STATE);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);

  useEffect(() => {
    (async () => {
      const saved = await loadProgress();
      if (saved) setProgress(saved);
      setIsLoadingProgress(false);
    })();
  }, []);

  const value = useMemo<ProgressContextValue>(
    () => ({
      progress,
      isLoadingProgress,
      completeLessonById: (lessonId: string, today = isoDate()) => {
        const lesson = lessons.find((item) => item.id === lessonId);
        if (!lesson) return null;

        let result: CompleteLessonResult | null = null;
        setProgress((prev) => {
          const completed = completeLesson(prev, lesson, today);
          result = completed.result;
          void saveProgress(completed.nextState);
          return completed.nextState;
        });
        return result;
      },
      resetProgress: () => {
        setProgress(INITIAL_PROGRESS_STATE);
        void saveProgress(INITIAL_PROGRESS_STATE);
      },
    }),
    [isLoadingProgress, progress],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used inside ProgressProvider');
  }
  return context;
}
