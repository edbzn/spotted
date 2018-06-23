import { AgmCoreModule } from '@agm/core';
import { HttpClient } from '@angular/common/http';
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
import { SharedModule } from './shared/shared.module';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpLoaderFactory } from 'src/app/app.translate.factory';
import { CoreModule } from './core/core.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AppComponent],
  imports: [
    SharedModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),

    /**
     * service worker only used in production build
     */
    ServiceWorkerModule.register('/ngsw-worker.js', {
      enabled: environment.production,
    }),

    CoreModule,
  ],
  providers: [environment.ENV_PROVIDERS],
  bootstrap: [AppComponent],
  exports: [],
})
export class AppModule {}
