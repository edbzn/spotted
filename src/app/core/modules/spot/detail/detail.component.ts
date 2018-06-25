import { Component, OnInit } from '@angular/core';
import { fadeAnimation } from '../../../../shared/router-animation';

@Component({
  selector: 'spt-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  animations: [fadeAnimation],
  // tslint:disable-next-line:use-host-property-decorator
  host: { '[@fadeAnimation]': '' },
})
export class DetailComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
