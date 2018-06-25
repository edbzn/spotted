import { NgModule } from '@angular/core';
import { SpotRoutingModule } from './spot-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpLoaderFactory } from '../../../app.translate.factory';
import { HttpClient } from '@angular/common/http';
import { DetailComponent } from './detail/detail.component';

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
    SpotRoutingModule,
  ],
  declarations: [DetailComponent],
  bootstrap: [DetailComponent],
})
export class SpotModule {}
