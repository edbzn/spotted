import { Component, OnInit } from '@angular/core';
import { fadeAnimation } from '../../../shared/router-animation';
import { appConfiguration } from '../../../app-config';

@Component({
  selector: 'spt-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  animations: [fadeAnimation],
  // tslint:disable-next-line:use-host-property-decorator
  host: { '[@fadeAnimation]': '' },
})
export class NotFoundComponent implements OnInit {
  public gifUrl = appConfiguration.notFoundImage;

  constructor() {}

  ngOnInit() {}
}
