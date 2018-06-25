import { Routes } from '@angular/router';
import { DashboardComponent } from './core/modules/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'user',
    loadChildren:
      './core/modules/authentication/authentication.module#AuthenticationModule',
  },
  { path: 'spots', loadChildren: './core/modules/spot/spot.module#SpotModule' },
  {
    path: 'not-found',
    loadChildren: './core/modules/not-found/not-found.module#NotFoundModule',
  },
  { path: '**', redirectTo: 'not-found' },
];
