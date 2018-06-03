import { Component } from '@angular/core';
import { environment } from '../environments/environment';

@Component({
  selector: 'spt-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public showDevModule: boolean = environment.showDevModule;
  public twitter: string = 'http://twitter.com/edouardbozon';
}
