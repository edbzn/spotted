import { Component, OnInit } from '@angular/core';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
} from '@angular/router';
import { ProgressBarService } from '../../services/progress-bar.service';
import { LanguageService } from '../../services/language.service';
import { AuthService } from '../../../authentication/auth.service';

@Component({
  selector: 'spt-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  progressBarMode = 'indeterminate';

  constructor(
    public language: LanguageService,
    public auth: AuthService,
    private progressBar: ProgressBarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.progressBar.increase();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel
      ) {
        this.progressBar.decrease();
      }
    });

    this.progressBar.updateProgressBar.subscribe(mode => {
      this.progressBarMode = mode;
    });
  }
}
