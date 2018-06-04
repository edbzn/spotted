import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'spt-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent implements OnInit {
  public gifUrl = 'https://media.giphy.com/media/3oriO3TIAR3cnAOcTK/giphy.gif';

  constructor() {}

  ngOnInit() {}
}
