import { Routes } from '@angular/router';
import { DashboardComponent } from './core/dashboard/dashboard.component';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { AuthGuard } from './core/authentication/auth-guard.service';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  { path: 'map', component: DashboardComponent },
  { path: '404', component: NotFoundComponent },

  {
    path: 'user',
    loadChildren:
      './core/authentication/authentication.module#AuthenticationModule',
  },

  { path: '**', redirectTo: '404' },
];
