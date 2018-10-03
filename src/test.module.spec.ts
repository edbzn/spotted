import 'hammerjs';

import { AgmCoreModule } from '@agm/core';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NguCarouselModule } from '@ngu/carousel';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';

import { ProgressBarService } from './app/core/services/progress-bar.service';
import { StorageService } from './app/core/services/storage.service';
import { WINDOW_PROVIDERS } from './app/core/services/window.service';
import { MaterialModule } from './app/shared/material.module';
import { environment } from './environments/environment';

@NgModule({
  imports: [
    RouterTestingModule,
    NguCarouselModule,
    NoopAnimationsModule,
    LeafletModule.forRoot(),
    ScrollToModule.forRoot(),
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: false,
    }),
    AgmCoreModule.forRoot({
      apiKey: environment.googleApiKey,
      libraries: ['places'],
    }),
    TranslateModule.forRoot({
      loader: { provide: TranslateLoader, useClass: TranslateFakeLoader },
    }),
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [ProgressBarService, StorageService, WINDOW_PROVIDERS],
  declarations: [],
  entryComponents: [],
  exports: [
    RouterTestingModule,
    NguCarouselModule,
    TranslateModule,
    LeafletModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
  ],
})
export class TestModule {}
