import { OverviewComponent } from './overview/overview.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { LatLng } from 'leaflet';
import { MapComponent } from './map/map.component';

@Component({
  selector: 'spt-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild('map') map: MapComponent;
  @ViewChild('overview') overview: OverviewComponent;

  ngOnInit(): void {}

  onSpotAdded(latLng: LatLng): void {
    this.overview.activeSpotTab();
    this.overview.fillSpotForm(latLng);
  }
}
