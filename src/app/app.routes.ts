import { Routes } from '@angular/router';
import { DashboardComponent } from './core/components/dashboard/dashboard.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'user',
    loadChildren: './authentication/authentication.module#AuthenticationModule',
  },
  {
    path: 'spots',
    loadChildren: './spot-detail/spot-detail.module#SpotModule',
  },
  {
    path: 'not-found',
    loadChildren: './not-found/not-found.module#NotFoundModule',
  },
  { path: '**', redirectTo: 'not-found' },
];
