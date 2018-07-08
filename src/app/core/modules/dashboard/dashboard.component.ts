import { OverviewComponent } from './overview/overview.component';
import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { LatLng } from 'leaflet';
import { Api } from 'src/types/api';
import { fadeAnimation } from '../../../shared/router-animation';
import { MapComponent } from 'src/app/core/modules/map/map.component';
import { distinct, debounceTime, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { DeviceDetectorService } from '../../services/device-detector.service';
import { appConfiguration } from '../../../app-config';

@Component({
  selector: 'spt-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fadeAnimation],
  // tslint:disable-next-line:use-host-property-decorator
  host: { '[@fadeAnimation]': '' },
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild('map') map: MapComponent;
  @ViewChild('overview') overview: OverviewComponent;

  mapInteractedSub: Subscription;
  overviewScrolledSub: Subscription;
  expandMap = false;
  mapHeight: number = this.deviceDetector.detectMobile()
    ? appConfiguration.map.totalMapHeight
    : appConfiguration.map.mobileExpandedMapHeight;

  constructor(
    public deviceDetector: DeviceDetectorService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.mapInteractedSub = this.map.mapInteracted
      .pipe(
        distinct(),
        debounceTime(80),
        tap(() => this.toggleExpand(true)),
        tap(() => this.map.map.invalidateSize())
      )
      .subscribe();

    this.overviewScrolledSub = this.overview.scrollChanged
      .pipe(
        distinct(),
        debounceTime(80),
        tap(() => this.toggleExpand(false))
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.mapInteractedSub.unsubscribe();
    this.overviewScrolledSub.unsubscribe();
  }

  toggleExpand(expanded: boolean | null = null): void {
    let toState = expanded;
    if (toState === null) {
      toState = !this.expandMap;
    }
    this.expandMap = toState;
    this.getMapHeight();
    this.changeDetector.detectChanges();
  }

  getMapHeight(): void {
    if (this.deviceDetector.detectMobile() === false) {
      this.mapHeight = appConfiguration.map.totalMapHeight;
      return;
    }

    const { totalMapHeight, mobileExpandedMapHeight } = appConfiguration.map;
    const shrinkMapHeight = totalMapHeight - mobileExpandedMapHeight;

    this.mapHeight = this.expandMap
      ? appConfiguration.map.mobileExpandedMapHeight
      : shrinkMapHeight;
  }

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
