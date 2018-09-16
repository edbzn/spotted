import { Routes } from '@angular/router';
import { DetailComponent } from './spot-detail.component';

export const routes: Routes = [
  { path: ':id/detail', component: DetailComponent },
];
