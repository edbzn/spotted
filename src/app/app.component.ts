import {
  AfterViewInit,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import * as Raven from 'raven-js';

import { environment } from '../environments/environment';
import { AuthService } from './authentication/auth.service';
import { PushService } from './core/services/push.service';
import { UpdateService } from './core/services/update.service';

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
    private translate: TranslateService,
    private snackBar: MatSnackBar,
    private title: Title,
    private pushService: PushService,
    private updateService: UpdateService,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.pushService.subscribeToPush();
    this.updateService.handleVersionUpdate();
    this.setRavenContext();
  }

  ngAfterViewInit() {
    this.title.setTitle('Spotted');
    this.checkBrowserFeatures();
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

  private setRavenContext(): void {
    if (this.auth.authenticated) {
      const { user } = this.auth;
      Raven.setUserContext({
        username: user.displayName,
        email: user.email,
        id: user.uid,
      });
    }
  }
}
