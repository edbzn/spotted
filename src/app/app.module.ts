import { AgmCoreModule } from '@agm/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { NguCarouselModule } from '@ngu/carousel';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';
import { AuthGuard } from './core/authentication/auth-guard.service';
import { DashboardComponent } from './core/dashboard/dashboard.component';
import { MapComponent } from './core/dashboard/map/map.component';
import { OverviewComponent } from './core/dashboard/overview/overview.component';
import { GeocoderService } from './core/geocoder.service';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { ProgressBarService } from './core/progress-bar.service';
import { SpotsService } from './core/spots.service';
import { StorageService } from './core/storage.service';
import { UploadService } from './core/upload.service';
import { WINDOW_PROVIDERS } from './core/window.service';
import { ProgressInterceptor } from './shared/progress.interceptor';
import { SharedModule } from './shared/shared.module';
import { TimingInterceptor } from './shared/timing.interceptor';
import { AngularFireStorageModule } from 'angularfire2/storage';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    MapComponent,
    OverviewComponent,
    NotFoundComponent,
  ],
  imports: [
    SharedModule.forRoot(),
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
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
    AuthGuard,
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
