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
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

const materialModules = [
  MatProgressSpinnerModule,
  MatInputModule,
  MatToolbarModule,
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatInputModule,
  MatTabsModule,
  MatListModule,
  MatIconModule,
];

@NgModule({
  imports: [BrowserModule, ...materialModules],
  providers: [],
  declarations: [],
  entryComponents: [],
  exports: [BrowserModule, ...materialModules],
})
export class MaterialModule {}
