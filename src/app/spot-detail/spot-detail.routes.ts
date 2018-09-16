import { Routes } from '@angular/router';
import { DetailComponent } from './spot-detail.component';

export const routes: Routes = [
  { path: ':id', redirectTo: ':id/detail' },
  { path: ':id/detail', component: DetailComponent },
  { path: '', redirectTo: '/not-found', pathMatch: 'full' },
];
