import { NgModule } from '@angular/core';
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
import { SpotsService } from './core/spots.service';
import { AngularFireModule } from 'angularfire2';

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

    /**
     * This section will import the module only in certain build types.
     */
    ...(environment.showDevModule ? [] : []),

    // service worker only used in production build
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production,
    }),
  ],

  providers: [environment.ENV_PROVIDERS, WINDOW_PROVIDERS, SpotsService],
  bootstrap: [AppComponent],
})
export class AppModule {}
