import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';

const sharedModules = [
  BrowserModule,
  FormsModule,
  ReactiveFormsModule,
  HttpClientModule,
  BrowserAnimationsModule,
  CommonModule,
  MaterialModule,
];

@NgModule({
  imports: [...sharedModules],
  providers: [],
  declarations: [],
  entryComponents: [],
  exports: [...sharedModules],
})
export class SharedModule {}
