import { NgModule, Optional, SkipSelf } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { throwIfAlreadyLoaded } from '../module-import-guard';
import { WINDOW_PROVIDERS } from './services/window.service';
import { SpotsService } from './services/spots.service';
import { ProgressBarService } from './services/progress-bar.service';
import { StorageService } from './services/storage.service';
import { UploadService } from './services/upload.service';
import { GeocoderService } from './services/geocoder.service';
import { AuthGuard } from './modules/authentication/auth-guard.service';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { ProgressInterceptor } from '../shared/progress.interceptor';
import { TimingInterceptor } from '../shared/timing.interceptor';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { MapComponent } from './modules/dashboard/map/map.component';
import { OverviewComponent } from './modules/dashboard/overview/overview.component';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { NguCarouselModule } from '@ngu/carousel';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AppRoutingModule } from '../app-routing.module';
import { AngularFireModule } from 'angularfire2';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AgmCoreModule } from '@agm/core';
import { environment } from '../../environments/environment';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../app.translate.factory';

@NgModule({
  imports: [
    SharedModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    NguCarouselModule,
    AngularFireModule.initializeApp(environment.firebase),
    LeafletModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: environment.googleApiKey,
      libraries: ['places'],
    }),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      isolate: false,
    }),
    AppRoutingModule,
  ],
  declarations: [DashboardComponent, MapComponent, OverviewComponent],
  providers: [
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
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule
  ) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
