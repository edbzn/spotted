import { Component, OnInit } from '@angular/core';
import { fadeAnimation } from '../../../../shared/router-animation';
import { SpotsService } from '../../../services/spots.service';
import { map, tap, mergeMap, take } from 'rxjs/internal/operators';
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
export class DetailComponent implements OnInit {
  spot: Api.Spot;

  constructor(
    public spotsService: SpotsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // get spot data from router param
    this.route.params
      .pipe(
        mergeMap(params =>
          this.spotsService.spots.pipe(
            map(spots => spots.filter(spot => spot.id === params.id))
          )
        ),
        take(1)
      )
      .subscribe(spots => {
        this.spot = spots[0];
      });
  }
}
