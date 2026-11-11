import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonBadge,
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonNote,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';

import { formatLongDate } from '../../data/dates';
import { type ExerciseId, TOTAL_REPS, TOTAL_SETS } from '../../data/exercises';
import { WorkoutService } from '../../services/workout.service';

@Component({
  selector: 'app-today',
  templateUrl: './today.page.html',
  styleUrls: ['./today.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    IonBadge,
    IonNote,
  ],
})
export class TodayPage {
  readonly workout = inject(WorkoutService);
  private readonly router = inject(Router);

  readonly totalReps = TOTAL_REPS;
  readonly totalSets = TOTAL_SETS;
  readonly todayLabel = computed(() => formatLongDate(this.workout.today().date));

  open(exerciseId: ExerciseId): void {
    void this.router.navigate(['/workout', exerciseId]);
  }

  start(): void {
    const next = this.workout.nextUnfinished();
    void this.router.navigate(['/workout', next ?? 'squats']);
  }
}
