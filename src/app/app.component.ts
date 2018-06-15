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

declare const Modernizr;

@Component({
  selector: 'spt-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements AfterViewInit {
  public showDevModule: boolean = environment.showDevModule;
  public twitter = 'http://twitter.com/edouardbozon';
  public loading = true;

  constructor(
    private router: Router,
    private translateService: TranslateService,
    private snackBar: MatSnackBar
  ) {}

  ngAfterViewInit() {
    this.checkBrowserFeatures();
    this.translateService.setDefaultLang('fr');
    this.translateService.use('fr');

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loading = true;
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel
      ) {
        this.loading = false;
      }
    });
  }

  private checkBrowserFeatures() {
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
