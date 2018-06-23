import { Routes } from '@angular/router';
import { DashboardComponent } from './core/modules/dashboard/dashboard.component';
import { NotFoundComponent } from './core/modules/not-found/not-found.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },

  {
    path: 'user',
    loadChildren:
      './core/modules/authentication/authentication.module#AuthenticationModule',
  },

  { path: 'not-found', component: NotFoundComponent },
  { path: '**', redirectTo: 'not-found' },
];
