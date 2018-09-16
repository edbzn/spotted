import { NgModule, Optional, SkipSelf, ErrorHandler } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { throwIfAlreadyLoaded } from '../module-import-guard';
import { WINDOW_PROVIDERS } from './services/window.service';
import { ProgressBarService } from './services/progress-bar.service';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { ProgressInterceptor } from '../shared/progress.interceptor';
import { TimingInterceptor } from '../shared/timing.interceptor';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { OverviewComponent } from './components/overview/overview.component';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AppRoutingModule } from '../app-routing.module';
import { AngularFireModule } from 'angularfire2';
import { AgmCoreModule } from '@agm/core';
import { environment } from '../../environments/environment';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../app.translate.factory';
import { MapComponent } from './components/map/map.component';
import { ExceptionHandler } from './services/exception.handler.service';

@NgModule({
  imports: [
    SharedModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
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
  declarations: [DashboardComponent, OverviewComponent, MapComponent],
  providers: [
    WINDOW_PROVIDERS,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ProgressInterceptor,
      multi: true,
      deps: [ProgressBarService],
    },
    { provide: HTTP_INTERCEPTORS, useClass: TimingInterceptor, multi: true },
    { provide: ErrorHandler, useClass: ExceptionHandler },
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
