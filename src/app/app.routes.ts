import { Routes } from '@angular/router';
import { DashboardComponent } from './core/dashboard/dashboard.component';
import { NotFoundComponent } from './core/not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },

  {
    path: 'user',
    loadChildren:
      './core/authentication/authentication.module#AuthenticationModule',
  },

  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: 'not-found' },
];
