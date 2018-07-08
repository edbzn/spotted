import { Component, OnInit, AfterViewInit } from '@angular/core';
import { fadeAnimation } from '../../../../shared/router-animation';
import { SpotsService } from '../../../services/spots.service';
import { map, mergeMap, flatMap } from 'rxjs/internal/operators';
import { ActivatedRoute } from '@angular/router';
import { Api } from 'src/types/api';

@Component({
  selector: 'spt-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  animations: [fadeAnimation],
  // tslint:disable-next-line:use-host-property-decorator
  host: { '[@fadeAnimation]': '' },
})
export class DetailComponent implements AfterViewInit {
  spot: Api.Spot;

  constructor(
    public spotsService: SpotsService,
    private route: ActivatedRoute
  ) {}

  ngAfterViewInit() {
    // get spot data from router param
    this.route.params
      .pipe(
        flatMap(params =>
          this.spotsService.spots.pipe(
            map(spots => spots.filter(spot => spot.id === params.id)[0])
          )
        )
      )
      .subscribe(spot => (this.spot = spot));
  }
}
