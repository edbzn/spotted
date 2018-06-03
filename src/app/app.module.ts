import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { NoContentComponent } from './core/no-content';
import { HomeComponent } from './core/home/home.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent, NoContentComponent, HomeComponent],
  imports: [
    SharedModule,
    AppRoutingModule,

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
