import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { WorkoutPage } from './workout.page';

describe('WorkoutPage', () => {
  let component: WorkoutPage;
  let fixture: ComponentFixture<WorkoutPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutPage],
      providers: [provideRouter([{ path: 'workout/:exerciseId', component: WorkoutPage }])],
    }).compileComponents();

    await TestBed.inject(Router).navigateByUrl('/workout/squats');
    fixture = TestBed.createComponent(WorkoutPage);
    fixture.componentRef.setInput('exerciseId', 'squats');
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
