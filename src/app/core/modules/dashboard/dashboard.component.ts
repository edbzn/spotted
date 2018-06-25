import { OverviewComponent } from './overview/overview.component';
import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { LatLng } from 'leaflet';
import { Api } from 'src/types/api';
import { fadeAnimation } from '../../../shared/router-animation';
import { MapComponent } from 'src/app/core/modules/map/map.component';

@Component({
  selector: 'spt-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeAnimation],
  // tslint:disable-next-line:use-host-property-decorator
  host: { '[@fadeAnimation]': '' },
})
export class DashboardComponent implements OnInit {
  @ViewChild('map') map: MapComponent;
  @ViewChild('overview') overview: OverviewComponent;

  ngOnInit(): void {}

  onHelpMarkerChanged(latLng: LatLng): void {
    this.overview.setTabIndexTo(1);
    this.overview.fillSpotForm(latLng);
  }

  onSpotFormSubmitted(spot: Api.Spot): void {
    this.map.removeHelpMarker();
  }

  onFlyTo(latLng: LatLng): void {
    this.map.setPosition(latLng, 18);
  }

  onSpotClick(spot: Api.Spot): void {
    this.overview.scrollTo(spot);
  }
}
