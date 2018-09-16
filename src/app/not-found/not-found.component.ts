import { Component, OnInit } from '@angular/core';
import { fade } from '../shared/animations';
import { appConfiguration } from '../app-config';

@Component({
  selector: 'spt-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  animations: [fade],
  // tslint:disable-next-line:use-host-property-decorator
  host: { '[@fade]': '' },
})
export class NotFoundComponent implements OnInit {
  public gifUrl = appConfiguration.notFoundImage;

  constructor() {}

  ngOnInit() {}
}
