import { Component, AfterViewInit } from '@angular/core';
import { fadeAnimation } from '../../../../shared/router-animation';
import { SpotsService } from '../../../services/spots.service';
import { ActivatedRoute } from '@angular/router';
import { Api } from 'src/types/api';
import { AngularFireAuth } from 'angularfire2/auth';

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
    public auth: AngularFireAuth,
    private route: ActivatedRoute
  ) {}

  ngAfterViewInit() {
    // get spot data from router param
    this.route.params.subscribe(params => {
      this.spotsService.get(params.id).then(spot => {
        this.spot = spot.data() as Api.Spot;
      });
    });
  }
}
