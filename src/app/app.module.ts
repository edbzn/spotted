import { AgmCoreModule } from '@agm/core';
import { GeocoderService } from './core/geocoder.service';
import { StorageService } from './core/storage.service';
import { AngularFireModule } from 'angularfire2';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';
import { DashboardComponent } from './core/dashboard/dashboard.component';
import { NguCarouselModule } from '@ngu/carousel';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MapComponent } from './core/dashboard/map/map.component';
import { NgModule } from '@angular/core';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { OverviewComponent } from './core/dashboard/overview/overview.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { SharedModule } from './shared/shared.module';
import { SpotsService } from './core/spots.service';
import { WINDOW_PROVIDERS } from './core/window.service';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ProgressInterceptor } from './shared/progress.interceptor';
import { ProgressBarService } from './core/progress-bar.service';
import { TimingInterceptor } from './shared/timing.interceptor';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from './app.translate.factory';
import { UploadService } from './core/upload.service';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MapComponent,
    OverviewComponent,
    NotFoundComponent,
  ],
  imports: [
    SharedModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    LeafletModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: environment.googleApiKey,
      libraries: ['places'],
    }),
    NguCarouselModule,

    /**
     * This section will import the module only in certain build types.
     */
    ...(environment.showDevModule ? [] : []),

    /**
     * service worker only used in production build
     */
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production,
    }),
  ],

  providers: [
    environment.ENV_PROVIDERS,
    WINDOW_PROVIDERS,
    SpotsService,
    ProgressBarService,
    StorageService,
    UploadService,
    GeocoderService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ProgressInterceptor,
      multi: true,
      deps: [ProgressBarService],
    },
    { provide: HTTP_INTERCEPTORS, useClass: TimingInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
