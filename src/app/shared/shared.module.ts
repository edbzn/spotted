import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

export const sharedModules = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  HttpClientModule,
  MaterialModule,
  FlexLayoutModule,
];

@NgModule({
  imports: [...sharedModules],
  providers: [],
  declarations: [],
  entryComponents: [],
  exports: [...sharedModules],
})
export class SharedModule {}
