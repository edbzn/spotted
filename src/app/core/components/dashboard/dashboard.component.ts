import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { LatLng, Map } from 'leaflet';
import { Subject, Subscription } from 'rxjs';
import {
  debounceTime,
  distinct,
  distinctUntilChanged,
  filter,
  switchMap,
  tap,
} from 'rxjs/operators';
import { Api } from 'src/types/api';
import { isEqual } from 'src/utils/functions/deep-compare';

import { appConfiguration } from '../../../app-config';
import { DeviceDetectorService } from '../../../core/services/device-detector.service';
import { fade } from '../../../shared/animations';
import { GeoSpotsService } from '../../services/geo-spots.service';
import { MapComponent } from '../map/map.component';
import { OverviewComponent } from '../overview/overview.component';

const listenMapChangeEvents = 'load zoomlevelschange move zoom';

@Component({
  selector: 'spt-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [fade],
  // tslint:disable-next-line:use-host-property-decorator
  host: { '[@fade]': '' },
})
export class DashboardComponent implements OnInit, OnDestroy {
  /**
   * Child map component ref
   */
  @ViewChild('map') map: MapComponent;

  /**
   * Child overview component ref
   */
  @ViewChild('overview') overview: OverviewComponent;

  /**
   * Spots displayed in map & overview 'around me'
   */
  spots: Api.Spot[] = [];

  /**
   * Track map move to handle spots in the given radius
   */
  mapMoved = new Subject<void>();

  /**
   * Map move subscription
   */
  mapMovedSub: Subscription;

  /**
   * Used to expand map when interacted
   */
  mapInteractedSub: Subscription;

  /**
   * Attach overview scroll change to expand overview
   */
  overviewScrolledSub: Subscription;

  /**
   * Expanded map state
   */
  expandMap = false;

  /**
   * Map height when mobile
   */
  mapHeight: number = this.deviceDetector.detectMobile()
    ? appConfiguration.map.totalMapHeight
    : appConfiguration.map.mobileExpandedMapHeight;

  constructor(
    public deviceDetector: DeviceDetectorService,
    private changeDetector: ChangeDetectorRef,
    private geoSpots: GeoSpotsService
  ) {}

  ngOnInit(): void {
    this.mapMovedSub = this.mapMoved
      .pipe(
        filter(() => this.overview.selectedTab === 0),
        debounceTime(200),
        tap(() => {
          this.searchSpotsFromMapBounds();
        }),
        switchMap(() => {
          return this.geoSpots.spots;
        }),
        distinctUntilChanged(
          (prevSpotsCollection: Api.Spot[], nextSpotsCollection: Api.Spot[]) =>
            isEqual(prevSpotsCollection, nextSpotsCollection)
        )
      )
      .subscribe(spots => {
        this.spots = spots;
        this.changeDetector.detectChanges();
      });

    this.mapInteractedSub = this.map.mapInteracted
      .pipe(
        filter(_ => this.deviceDetector.detectMobile()),
        distinct(),
        debounceTime(80),
        tap(() => {
          this.toggleExpand(true);
          this.map.map.invalidateSize();
        })
      )
      .subscribe();

    this.overviewScrolledSub = this.overview.scrollChanged
      .pipe(
        filter(_ => this.deviceDetector.detectMobile()),
        distinct(),
        debounceTime(80),
        tap(() => this.toggleExpand(false))
      )
      .subscribe();

    this.toggleExpand(false);
  }

  ngOnDestroy(): void {
    this.mapInteractedSub.unsubscribe();
    this.overviewScrolledSub.unsubscribe();
    this.mapMovedSub.unsubscribe();
    this.map.map.off(listenMapChangeEvents);
  }

  onMapReady(map: Map) {
    map.on(listenMapChangeEvents, () => {
      this.mapMoved.next();
    });
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

  onSpotFormSubmitted(): void {
    this.map.removeHelpMarker();
  }

  onFlyTo(latLng: LatLng): void {
    this.map.setPosition(latLng, appConfiguration.map.maxZoom);
  }

  onSpotClick(spot: Api.Spot): void {
    this.overview.scrollTo(spot);
  }

  private searchSpotsFromMapBounds(): void {
    this.geoSpots.getSpotsByLocation(
      { latitude: this.map.lat, longitude: this.map.lng },
      this.getRadiusFromBounds()
    );
  }

  private getRadiusFromBounds(): number {
    return (
      (this.map.map.getBounds().getEast() -
        this.map.map.getBounds().getWest()) *
      100
    );
  }
}
