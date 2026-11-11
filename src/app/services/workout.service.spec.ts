import { Haptics } from '@capacitor/haptics';
import { Preferences } from '@capacitor/preferences';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { EXERCISES, SETS_PER_EXERCISE } from '../data/exercises';

import { WorkoutService } from './workout.service';

vi.mock('@capacitor/preferences', () => ({
  Preferences: {
    get: vi.fn(),
    set: vi.fn(),
  },
}));

vi.mock('@capacitor/haptics', () => ({
  Haptics: {
    impact: vi.fn(),
  },
  ImpactStyle: {
    Medium: 'MEDIUM',
  },
}));

describe('WorkoutService', () => {
  beforeEach(() => {
    vi.mocked(Preferences.get).mockResolvedValue({ value: null });
    vi.mocked(Preferences.set).mockResolvedValue();
    vi.mocked(Haptics.impact).mockResolvedValue();
  });

  it('counts sets of 10 and clamps at 10', async () => {
    const service = await createReadyService();

    service.completeSet('squats');
    expect(service.setsFor('squats')).toBe(1);
    expect(service.totalCompletedReps()).toBe(10);

    for (let i = 0; i < 12; i += 1) {
      service.completeSet('squats');
    }

    expect(service.setsFor('squats')).toBe(SETS_PER_EXERCISE);
    expect(service.progress()[0]?.done).toBe(true);
  });

  it('undoes the last set without going below zero', async () => {
    const service = await createReadyService();

    service.undoSet('pushUps');
    expect(service.setsFor('pushUps')).toBe(0);

    service.completeSet('pushUps');
    service.completeSet('pushUps');
    service.undoSet('pushUps');
    expect(service.setsFor('pushUps')).toBe(1);
  });

  it('marks the day complete after all four exercises and starts a streak', async () => {
    const service = await createReadyService();

    for (const exercise of EXERCISES) {
      for (let i = 0; i < SETS_PER_EXERCISE; i += 1) {
        service.completeSet(exercise.id);
      }
    }

    expect(service.isDayComplete()).toBe(true);
    expect(service.totalCompletedReps()).toBe(400);
    expect(service.streak()).toBe(1);
    expect(service.completedHistory()[0]?.label).toBe('Today');
  });

  it('returns the next unfinished exercise after the current one', async () => {
    const service = await createReadyService();

    for (let i = 0; i < SETS_PER_EXERCISE; i += 1) {
      service.completeSet('squats');
    }

    expect(service.nextUnfinished('squats')).toBe('pushUps');
  });
});

async function createReadyService(): Promise<WorkoutService> {
  const service = new WorkoutService();
  await vi.waitFor(() => expect(service.loaded()).toBe(true));
  return service;
}
