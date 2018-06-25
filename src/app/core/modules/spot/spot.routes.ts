import { Routes } from '@angular/router';
import { DetailComponent } from './detail/detail.component';

export const routes: Routes = [
  { path: '', component: DetailComponent },
  { path: ':id/detail', component: DetailComponent },
];
