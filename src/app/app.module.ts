import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { HomeComponent } from './core/home/home.component';
import { SharedModule } from './shared/shared.module';
import { MapComponent } from './core/home/map/map.component';
import { OverviewComponent } from './core/home/overview/overview.component';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { WINDOW_PROVIDERS } from './core/window.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MapComponent,
    OverviewComponent,
    NotFoundComponent,
  ],
  imports: [
    SharedModule,
    AppRoutingModule,

    AgmCoreModule.forRoot({
      apiKey: environment.googleMapApiKey,
      libraries: ['places'],
    }),

    /**
     * This section will import the `void` only in certain build types.
     * When the module is not imported it will get tree shaked.
     * This is a simple example, a big app should probably implement some logic
     */
    ...(environment.showDevModule ? [] : []),

    // service worker only used in production build
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production,
    }),
  ],

  providers: [environment.ENV_PROVIDERS, WINDOW_PROVIDERS],
  bootstrap: [AppComponent],
})
export class AppModule {}
