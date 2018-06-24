import { Component, OnInit } from '@angular/core';
import { fadeAnimation } from '../../../shared/router-animation';

@Component({
  selector: 'spt-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
  animations: [fadeAnimation],
  // tslint:disable-next-line:use-host-property-decorator
  host: { '[@fadeAnimation]': '' },
})
export class NotFoundComponent implements OnInit {
  public gifUrl = 'https://media.giphy.com/media/3oriO3TIAR3cnAOcTK/giphy.gif';

  constructor() {}

  ngOnInit() {}
}
