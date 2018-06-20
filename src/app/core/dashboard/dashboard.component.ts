import { OverviewComponent } from './overview/overview.component';
import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { LatLng } from 'leaflet';
import { MapComponent } from './map/map.component';
import { Api } from 'src/types/api';

@Component({
  selector: 'spt-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  @ViewChild('map') map: MapComponent;
  @ViewChild('overview') overview: OverviewComponent;

  ngOnInit(): void {}

  onHelpMarkerChanged(latLng: LatLng): void {
    this.overview.activateSpotTab();
    this.overview.fillSpotForm(latLng);
  }

  onSpotFormSubmitted(spot: Api.Spot): void {
    this.map.removeHelpMarker();
  }

  onFlyTo(latLng: LatLng): void {
    this.map.setPosition(latLng, 18);
  }
}
