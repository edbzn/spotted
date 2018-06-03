import {
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatProgressSpinnerModule,
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

const materialModules = [
  MatProgressSpinnerModule,
  MatToolbarModule,
  MatButtonModule,
  MatMenuModule,
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
];

@NgModule({
  imports: [BrowserModule, ...materialModules],
  providers: [],
  declarations: [],
  entryComponents: [],
  exports: [BrowserModule, ...materialModules],
})
export class MaterialModule {}
