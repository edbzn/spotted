import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import {
  TranslateModule,
  TranslateLoader,
  TranslateService,
} from '@ngx-translate/core';
import { HttpLoaderFactory } from '../app.translate.factory';
import { StorageService } from '../core/storage.service';

const sharedModules = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  HttpClientModule,
  MaterialModule,
  TranslateModule,
];

const providers = [
  {
    provide: TranslateLoader,
    useFactory: HttpLoaderFactory,
    deps: [HttpClient],
  },
  TranslateService,
];

@NgModule({
  imports: [...sharedModules],
  providers: [...providers],
  declarations: [],
  entryComponents: [],
  exports: [...sharedModules],
})
export class SharedModule {
  constructor(translateService: TranslateService, storage: StorageService) {
    const defaultLang =
      storage.get('defaultLang') || translateService.getBrowserLang();

    translateService.setDefaultLang(defaultLang);
    translateService.use(defaultLang);
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
        TranslateService,
      ],
    };
  }
}
