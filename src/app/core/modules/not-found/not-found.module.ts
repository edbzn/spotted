import { NgModule } from '@angular/core';
import { NotFoundRoutingModule } from './not-found-routing.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { SharedModule } from '../../../shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { HttpLoaderFactory } from '../../../app.translate.factory';
import { NotFoundComponent } from './not-found.component';

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
    NotFoundRoutingModule,
  ],
  declarations: [NotFoundComponent],
  bootstrap: [NotFoundComponent],
})
export class NotFoundModule {}
