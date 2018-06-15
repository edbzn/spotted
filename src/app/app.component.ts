import { Component, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { environment } from '../environments/environment';
import {
  NavigationStart,
  Router,
  NavigationEnd,
  NavigationCancel,
} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

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
    private translateService: TranslateService
  ) {}

  ngAfterViewInit() {
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
}
