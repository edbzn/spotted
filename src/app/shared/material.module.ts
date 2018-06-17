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
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
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
];

@NgModule({
  imports: [BrowserModule, ...materialModules],
  providers: [],
  declarations: [],
  entryComponents: [],
  exports: [BrowserModule, ...materialModules],
})
export class MaterialModule {}
