import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path: 'today',
        loadComponent: () => import('./pages/today/today.page').then((m) => m.TodayPage),
      },
      {
        path: 'history',
        loadComponent: () => import('./pages/history/history.page').then((m) => m.HistoryPage),
      },
      {
        path: '',
        redirectTo: '/tabs/today',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'workout/:exerciseId',
    loadComponent: () => import('./pages/workout/workout.page').then((m) => m.WorkoutPage),
  },
  {
    path: '',
    redirectTo: '/tabs/today',
    pathMatch: 'full',
  },
];
