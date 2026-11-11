import { computed, Service, signal } from '@angular/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Preferences } from '@capacitor/preferences';

import { formatDayLabel, localDateKey, shiftDateKey } from '../data/dates';
import {
  emptyCompletedSets,
  EXERCISE_IDS,
  EXERCISES,
  type ExerciseId,
  REPS_PER_SET,
  SETS_PER_EXERCISE,
  TOTAL_REPS,
  TOTAL_SETS,
} from '../data/exercises';

export interface WorkoutDay {
  date: string;
  completedSets: Record<ExerciseId, number>;
}

interface StoredState {
  days: WorkoutDay[];
}

const STORAGE_KEY = 'daily100.days';
const HISTORY_DAYS = 90;

@Service()
export class WorkoutService {
  private readonly storedDays = signal<WorkoutDay[]>([]);
  private readonly todayKey = signal(localDateKey());
  readonly loaded = signal(false);

  readonly today = computed(() => {
    const key = this.todayKey();
    return this.storedDays().find((day) => day.date === key) ?? emptyDay(key);
  });

  readonly progress = computed(() => {
    const day = this.today();
    return EXERCISES.map((exercise) => {
      const completedSets = clampSets(day.completedSets[exercise.id]);
      return {
        ...exercise,
        completedSets,
        completedReps: completedSets * REPS_PER_SET,
        remainingSets: SETS_PER_EXERCISE - completedSets,
        done: completedSets >= SETS_PER_EXERCISE,
      };
    });
  });

  readonly totalCompletedSets = computed(() =>
    this.progress().reduce((sum, exercise) => sum + exercise.completedSets, 0),
  );

  readonly totalCompletedReps = computed(() => this.totalCompletedSets() * REPS_PER_SET);

  readonly totalRemainingSets = computed(() => TOTAL_SETS - this.totalCompletedSets());

  readonly percentComplete = computed(() =>
    Math.round((this.totalCompletedReps() / TOTAL_REPS) * 100),
  );

  readonly isDayComplete = computed(() => this.progress().every((exercise) => exercise.done));

  readonly streak = computed(() => computeStreak(this.storedDays(), this.todayKey()));

  readonly completedHistory = computed(() => {
    const today = this.todayKey();
    return this.storedDays()
      .filter((day) => isDayComplete(day))
      .map((day) => ({
        date: day.date,
        label: formatDayLabel(day.date, today),
      }))
      .sort((a, b) => b.date.localeCompare(a.date));
  });

  constructor() {
    void this.hydrate();
  }

  setsFor(exerciseId: ExerciseId): number {
    return clampSets(this.today().completedSets[exerciseId]);
  }

  nextUnfinished(afterId?: ExerciseId): ExerciseId | null {
    const progress = this.progress();
    const startIndex = afterId ? progress.findIndex((exercise) => exercise.id === afterId) + 1 : 0;
    const ordered = [...progress.slice(startIndex), ...progress.slice(0, startIndex)];
    return ordered.find((exercise) => !exercise.done)?.id ?? null;
  }

  completeSet(exerciseId: ExerciseId): void {
    const changed = this.updateSets(exerciseId, 1);
    if (changed) {
      void buzz();
    }
  }

  undoSet(exerciseId: ExerciseId): void {
    this.updateSets(exerciseId, -1);
  }

  private updateSets(exerciseId: ExerciseId, delta: number): boolean {
    const key = this.todayKey();
    let changed = false;

    this.storedDays.update((days) => {
      const existing = days.find((day) => day.date === key);
      const day: WorkoutDay = existing
        ? { date: existing.date, completedSets: { ...existing.completedSets } }
        : emptyDay(key);
      const current = clampSets(day.completedSets[exerciseId]);
      const next = clampSets(current + delta);
      changed = next !== current;
      day.completedSets[exerciseId] = next;
      return pruneDays(
        [day, ...days.filter((stored) => stored.date !== key)],
        key,
      );
    });

    if (changed) {
      void this.persist();
    }

    return changed;
  }

  private async hydrate(): Promise<void> {
    this.todayKey.set(localDateKey());

    try {
      const { value } = await Preferences.get({ key: STORAGE_KEY });
      if (value) {
        const parsed: unknown = JSON.parse(value);
        const days = parseStoredDays(parsed);
        this.storedDays.set(pruneDays(days, this.todayKey()));
      }
    } catch {
      this.storedDays.set([]);
    } finally {
      this.loaded.set(true);
    }
  }

  private async persist(): Promise<void> {
    const state: StoredState = { days: this.storedDays() };
    await Preferences.set({
      key: STORAGE_KEY,
      value: JSON.stringify(state),
    });
  }
}

function emptyDay(date: string): WorkoutDay {
  return {
    date,
    completedSets: emptyCompletedSets(),
  };
}

function clampSets(value: number): number {
  return Math.min(SETS_PER_EXERCISE, Math.max(0, value));
}

function isDayComplete(day: WorkoutDay): boolean {
  return EXERCISE_IDS.every((id) => clampSets(day.completedSets[id]) >= SETS_PER_EXERCISE);
}

function computeStreak(days: WorkoutDay[], todayKey: string): number {
  const completed = new Set(days.filter((day) => isDayComplete(day)).map((day) => day.date));
  let cursor = completed.has(todayKey) ? todayKey : shiftDateKey(todayKey, -1);
  let streak = 0;

  while (completed.has(cursor)) {
    streak += 1;
    cursor = shiftDateKey(cursor, -1);
  }

  return streak;
}

function pruneDays(days: WorkoutDay[], todayKey: string): WorkoutDay[] {
  const cutoff = shiftDateKey(todayKey, -HISTORY_DAYS);
  return days.filter((day) => day.date >= cutoff);
}

function parseStoredDays(value: unknown): WorkoutDay[] {
  if (!value || typeof value !== 'object' || !('days' in value) || !Array.isArray(value.days)) {
    return [];
  }

  return value.days.flatMap((day) => {
    const parsed = parseWorkoutDay(day);
    return parsed ? [parsed] : [];
  });
}

function parseWorkoutDay(value: unknown): WorkoutDay | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const record = value as Record<string, unknown>;
  if (typeof record['date'] !== 'string') {
    return null;
  }

  const sets = record['completedSets'];
  if (!sets || typeof sets !== 'object') {
    return null;
  }

  const completedSets = emptyCompletedSets();
  for (const id of EXERCISE_IDS) {
    const raw = (sets as Record<string, unknown>)[id];
    completedSets[id] = typeof raw === 'number' && Number.isFinite(raw) ? clampSets(raw) : 0;
  }

  return {
    date: record['date'],
    completedSets,
  };
}

async function buzz(): Promise<void> {
  try {
    await Haptics.impact({ style: ImpactStyle.Medium });
  } catch {
    // Haptics are unavailable in some browsers and emulators.
  }
}
