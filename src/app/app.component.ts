import { StorageService } from './core/storage.service';
import { Component, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { environment } from '../environments/environment';
import {
  NavigationStart,
  Router,
  NavigationEnd,
  NavigationCancel,
} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material';
import { ProgressBarService } from './core/progress-bar.service';
import { Language } from '../types/global';
import { Title, Meta } from '@angular/platform-browser';

declare const Modernizr;

@Component({
  selector: 'spt-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements AfterViewInit {
  progressBarMode: string;

  showDevModule: boolean = environment.showDevModule;

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private progressBarService: ProgressBarService,
    private storage: StorageService,
    private snackBar: MatSnackBar,
    private title: Title,
    private meta: Meta
  ) {}

  ngAfterViewInit() {
    this.title.setTitle('Spotted');

    // @todo add meta creation
    this.checkBrowserFeatures();
    const defaultLang = this.storage.get('defaultLang') || 'fr';
    this.translateService.setDefaultLang(defaultLang);
    this.translateService.use(defaultLang);

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.progressBarService.increase();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel
      ) {
        this.progressBarService.decrease();
      }
    });

    this.progressBarService.updateProgressBar$.subscribe((mode: string) => {
      this.progressBarMode = mode;
    });
  }

  changeLanguage(language: Language): void {
    this.storage.store('defaultLang', language);
    this.translateService.use(language).subscribe(() => {
      // @todo load translated menus
    });
  }

  private checkBrowserFeatures(): boolean {
    let supported = true;
    for (const feature in Modernizr) {
      if (
        Modernizr.hasOwnProperty(feature) &&
        typeof Modernizr[feature] === 'boolean' &&
        Modernizr[feature] === false
      ) {
        supported = false;
        break;
      }
    }

    if (!supported) {
      this.translateService.get(['updateBrowser']).subscribe(texts => {
        this.snackBar.open(texts['updateBrowser'], 'OK');
      });
    }

    return supported;
  }
}
