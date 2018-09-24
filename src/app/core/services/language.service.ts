import { Injectable } from '@angular/core';
import { Language } from 'src/types/global';
import { appConfiguration } from '../../app-config';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  constructor(
    private translate: TranslateService,
    private storage: StorageService
  ) {
    this.setupLanguage();
  }

  /**
   * Switch app language on the fly
   */
  changeLanguage(language: Language): void {
    this.storage.store('defaultLang', language);
    this.translate.use(language).subscribe(() => {
      // @todo load translated menus
    });
  }

  /**
   * Setup app language at init
   */
  private setupLanguage(): void {
    const langs: Language[] = ['en', 'fr'];
    this.translate.addLangs(langs);
    this.translate.setDefaultLang(appConfiguration.defaultLang);

    const fromStorage = this.storage.get('defaultLang');
    const browserLang = fromStorage || this.translate.getBrowserLang();
    const lang = browserLang.match(/en|fr/)
      ? browserLang
      : appConfiguration.defaultLang;

    this.translate.use(lang);
  }
}
