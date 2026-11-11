export const SETS_PER_EXERCISE = 10;
export const REPS_PER_SET = 10;
export const TARGET_REPS = SETS_PER_EXERCISE * REPS_PER_SET;

export const EXERCISES = [
  { id: 'squats', name: 'Squats', icon: 'fitness-outline' },
  { id: 'pushUps', name: 'Push-ups', icon: 'body-outline' },
  { id: 'sideKneeRaises', name: 'Side Knee Raises', icon: 'walk-outline' },
  { id: 'crossKneeRaises', name: 'Cross-Knee Raises', icon: 'swap-horizontal-outline' },
] as const;

export type ExerciseId = (typeof EXERCISES)[number]['id'];
export type Exercise = (typeof EXERCISES)[number];

export const EXERCISE_IDS = EXERCISES.map((exercise) => exercise.id);

export const TOTAL_SETS = SETS_PER_EXERCISE * EXERCISES.length;
export const TOTAL_REPS = TARGET_REPS * EXERCISES.length;

export const SET_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export function isExerciseId(value: string): value is ExerciseId {
  return EXERCISE_IDS.includes(value as ExerciseId);
}

export function emptyCompletedSets(): Record<ExerciseId, number> {
  return {
    squats: 0,
    pushUps: 0,
    sideKneeRaises: 0,
    crossKneeRaises: 0,
  };
}
