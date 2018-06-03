import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { HomeComponent } from './core/home/home.component';
import { SharedModule } from './shared/shared.module';
import { MapComponent } from './core/map/map.component';
import { OverviewComponent } from './core/overview/overview.component';
import { NotFoundComponent } from './core/not-found/not-found.component';

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
    }),

    /**
     * This section will import the `void` only in certain build types.
     * When the module is not imported it will get tree shaked.
     * This is a simple example, a big app should probably implement some logic
     */
    ...(environment.showDevModule ? [] : []),
  ],

  providers: [environment.ENV_PROVIDERS],
  bootstrap: [AppComponent],
})
export class AppModule {}
