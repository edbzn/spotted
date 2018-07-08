import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { SpotComponent } from './spot/spot.component';
import { NguCarouselModule } from '@ngu/carousel';
import { RouterModule } from '@angular/router';

export const sharedModules = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  HttpClientModule,
  MaterialModule,
  FlexLayoutModule,
  NguCarouselModule,
  RouterModule,
];

@NgModule({
  imports: [...sharedModules],
  providers: [],
  declarations: [SpotComponent],
  entryComponents: [],
  exports: [...sharedModules, SpotComponent],
})
export class SharedModule {}
