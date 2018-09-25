import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { ErrorHandler, NgModule, Optional, SkipSelf } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { HttpLoaderFactory } from '../app.translate.factory';
import { ProgressInterceptor } from '../shared/progress.interceptor';
import { SharedModule } from '../shared/shared.module';
import { TimingInterceptor } from '../shared/timing.interceptor';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MapComponent } from './components/map/map.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { OverviewComponent } from './components/overview/overview.component';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { ExceptionHandler } from './services/exception.handler.service';
import { ProgressBarService } from './services/progress-bar.service';
import { WINDOW_PROVIDERS } from './services/window.service';

@NgModule({
  imports: [
    SharedModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      isolate: false,
    }),
  ],
  declarations: [
    DashboardComponent,
    OverviewComponent,
    MapComponent,
    NavbarComponent,
  ],
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
  exports: [NavbarComponent],
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
