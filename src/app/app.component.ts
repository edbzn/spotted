import { appConfiguration } from './app-config';
import { StorageService } from './core/services/storage.service';
import {
  Component,
  AfterViewInit,
  ViewEncapsulation,
  OnInit,
  Inject,
} from '@angular/core';
import { environment } from '../environments/environment';
import {
  NavigationStart,
  Router,
  NavigationEnd,
  NavigationCancel,
} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material';
import { ProgressBarService } from './core/services/progress-bar.service';
import { Language } from '../types/global';
import { Title, Meta } from '@angular/platform-browser';
import { AngularFireAuth } from 'angularfire2/auth';
import { SwUpdate } from '@angular/service-worker';
import { WINDOW } from './core/services/window.service';
import { PushService } from './core/services/push.service';

declare const Modernizr;

@Component({
  selector: 'spt-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements AfterViewInit, OnInit {
  progressBarMode: string;

  showDevModule: boolean = environment.showDevModule;

  constructor(
    private router: Router,
    private translate: TranslateService,
    private progressBarService: ProgressBarService,
    private storage: StorageService,
    private snackBar: MatSnackBar,
    private title: Title,
    private meta: Meta,
    private swUpdate: SwUpdate,
    @Inject(WINDOW) private window: Window,
    private pushService: PushService,
    public auth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    const langs: Language[] = ['en', 'fr'];
    this.translate.addLangs(langs);
    this.translate.setDefaultLang(appConfiguration.defaultLang);

    const fromStorage = this.storage.get('defaultLang');
    const browserLang = fromStorage || this.translate.getBrowserLang();
    this.translate.use(
      browserLang.match(/en|fr/) ? browserLang : appConfiguration.defaultLang
    );

    this.pushService.subscribeToPush();
    this.pushService.checkForUpdate();
  }

  ngAfterViewInit() {
    this.title.setTitle('Spotted');

    // @todo add meta creation
    this.checkBrowserFeatures();
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
    this.translate.use(language).subscribe(() => {
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
      this.translate.get(['updateBrowser']).subscribe(texts => {
        this.snackBar.open(texts['updateBrowser'], 'OK');
      });
    }

    return supported;
  }

  private handleVersionUpdate(): void {
    this.swUpdate.available.subscribe(event => {
      console.log(
        '[App] Update available: current version is',
        event.current,
        'available version is',
        event.available
      );
      const snackBarRef = this.snackBar.open(
        'Newer version of the app is available',
        'Refresh'
      );

      snackBarRef.onAction().subscribe(() => {
        this.window.location.reload();
      });
    });
  }
}
