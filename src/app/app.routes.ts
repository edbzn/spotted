import { Routes } from '@angular/router';
import { DashboardComponent } from './core/components/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'user',
    loadChildren: './authentication/authentication.module#AuthenticationModule',
  },
  { path: 'spots', loadChildren: './spot/spot.module#SpotModule' },
  {
    path: 'not-found',
    loadChildren: './not-found/not-found.module#NotFoundModule',
  },
  { path: '**', redirectTo: 'not-found' },
];
