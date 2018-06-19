import {
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatProgressSpinnerModule,
  MatInputModule,
  MatTabsModule,
  MatListModule,
  MatSnackBarModule,
  MatProgressBarModule,
  MatStepperModule,
  MatSelectModule,
  MatRadioModule,
  MatBadgeModule,
  MatSlideToggleModule,
} from '@angular/material';
import { NgModule } from '@angular/core';

const materialModules = [
  MatProgressSpinnerModule,
  MatInputModule,
  MatToolbarModule,
  MatButtonModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatInputModule,
  MatTabsModule,
  MatListModule,
  MatIconModule,
  MatMenuModule,
  MatSnackBarModule,
  MatProgressBarModule,
  MatStepperModule,
  MatSelectModule,
  MatRadioModule,
  MatBadgeModule,
  MatSlideToggleModule,
];

@NgModule({
  imports: [...materialModules],
  providers: [],
  declarations: [],
  entryComponents: [],
  exports: [...materialModules],
})
export class MaterialModule {}
