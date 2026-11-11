import { Component, computed, effect, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';

import {
  EXERCISES,
  isExerciseId,
  SET_NUMBERS,
  SETS_PER_EXERCISE,
  TARGET_REPS,
} from '../../data/exercises';
import { WorkoutService } from '../../services/workout.service';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.page.html',
  styleUrls: ['./workout.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonContent,
    IonFooter,
    IonButton,
    IonIcon,
  ],
})
export class WorkoutPage {
  readonly exerciseId = input.required<string>();
  readonly workout = inject(WorkoutService);
  private readonly router = inject(Router);

  readonly setNumbers = SET_NUMBERS;
  readonly setsPerExercise = SETS_PER_EXERCISE;
  readonly targetReps = TARGET_REPS;

  readonly exercise = computed(() => {
    const id = this.exerciseId();
    return isExerciseId(id) ? EXERCISES.find((item) => item.id === id) : undefined;
  });

  readonly completedSets = computed(() => {
    const exercise = this.exercise();
    return exercise ? this.workout.setsFor(exercise.id) : 0;
  });

  readonly completedReps = computed(() => this.completedSets() * 10);

  readonly isExerciseComplete = computed(() => this.completedSets() >= SETS_PER_EXERCISE);

  constructor() {
    effect(() => {
      const id = this.exerciseId();
      if (!isExerciseId(id)) {
        void this.router.navigate(['/tabs/today'], { replaceUrl: true });
      }
    });
  }

  completeSet(): void {
    const exercise = this.exercise();
    if (!exercise || this.isExerciseComplete()) {
      return;
    }

    this.workout.completeSet(exercise.id);

    if (this.workout.setsFor(exercise.id) >= SETS_PER_EXERCISE) {
      const next = this.workout.nextUnfinished(exercise.id);
      if (next) {
        void this.router.navigate(['/workout', next], { replaceUrl: true });
      }
    }
  }

  undoSet(): void {
    const exercise = this.exercise();
    if (!exercise) {
      return;
    }

    this.workout.undoSet(exercise.id);
  }

  backToToday(): void {
    void this.router.navigate(['/tabs/today']);
  }
}
