import { AuthService } from './../../../authentication/auth.service';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { User } from 'firebase';
import { LatLng, Map } from 'leaflet';
import { combineLatest, Subject } from 'rxjs';
import {
  debounceTime,
  distinct,
  filter,
  mergeMap,
  switchMap,
  takeWhile,
  tap,
} from 'rxjs/operators';
import { Api } from 'src/types/api';

import { appConfiguration } from '../../../app-config';
import { DeviceDetectorService } from '../../../core/services/device-detector.service';
import { fade } from '../../../shared/animations';
import { SpotLocatorService } from '../../services/spot-locator.service';
import { SpotsService } from '../../services/spots.service';
import { UserLocatorService } from '../../services/user-locator.service';
import { MapComponent } from '../map/map.component';
import { OverviewComponent } from '../overview/overview.component';
import { OverviewTabIndex } from '../overview/tapbar-index.enum';

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
  @ViewChild('map')
  map: MapComponent;

  /**
   * Child overview component ref
   */
  @ViewChild('overview')
  overview: OverviewComponent;

  /**
   * Spots displayed in map & overview 'around me'
   */
  spots: Api.Spot[] = [];

  /**
   * Users displayed in map
   */
  users: User[] = [];

  /**
   * Track map move to handle spots in the given radius
   */
  mapMoved = new Subject<void>();

  /**
   * Expanded map state
   */
  expandMap = false;

  /**
   * Dynamic map height for desktop & mobile
   */
  mapHeight: number = this.deviceDetector.detectMobile()
    ? appConfiguration.map.totalMapHeight
    : appConfiguration.map.mobileExpandedMapHeight;

  /**
   * Used to unsubscribe component observables
   */
  alive = true;

  constructor(
    public deviceDetector: DeviceDetectorService,
    private changeDetector: ChangeDetectorRef,
    private spotLocator: SpotLocatorService,
    private userLocator: UserLocatorService,
    private spotService: SpotsService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.mapMoved
      .pipe(
        debounceTime(500),
        switchMap(() => {
          const radius = this.getRadiusFromBounds();
          const latLng = { latitude: this.map.lat, longitude: this.map.lng };

          return combineLatest([
            this.spotLocator.query(latLng, radius),
            this.userLocator.query(latLng, radius),
          ]);
        }),
        mergeMap(locations => {
          const [spots, users] = locations;

          console.log(users);

          return this.spotService.getByIds(
            spots.map(spotLocation => spotLocation.id)
          );
        }),
        takeWhile(() => this.alive)
      )
      .subscribe(spots => {
        this.spots = spots;
        this.changeDetector.detectChanges();
      });

    this.map.mapInteracted
      .pipe(
        filter(_ => this.deviceDetector.detectMobile()),
        distinct(),
        debounceTime(80),
        tap(() => {
          this.toggleExpand(true);
          this.map.map.invalidateSize();
        }),
        takeWhile(() => this.alive)
      )
      .subscribe();

    this.overview.scrollChanged
      .pipe(
        filter(_ => this.deviceDetector.detectMobile()),
        distinct(),
        debounceTime(80),
        tap(() => this.toggleExpand(false)),
        takeWhile(() => this.alive)
      )
      .subscribe();

    this.toggleExpand(false);
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

  onMapReady(map: Map): void {
    map.on(listenMapChangeEvents, () => {
      this.mapMoved.next();
    });
  }

  onHelpMarkerChanged(latLng: LatLng): void {
    this.overview.setTabIndexTo(OverviewTabIndex.CreateSpot);
    this.overview.fillSpotForm(latLng);
  }

  onSpotFormSubmitted(): void {
    this.map.removeHelpMarker();
  }

  onFlyTo(latLng: LatLng): void {
    this.map.setPosition(latLng, appConfiguration.map.maxZoom);
  }

  onSpotClick(spot: Api.Spot): void {
    if (this.deviceDetector.detectMobile()) {
      this.toggleExpand(false);
    }

    this.overview.triggerScrollTo(
      this.spots.findIndex(_spot => spot.id === _spot.id)
    );
  }

  toggleExpand(expanded: boolean | null = null): void {
    let toState = expanded;
    if (toState === null) {
      toState = !this.expandMap;
    }
    this.expandMap = toState;
    this.updateMapHeight();
    this.changeDetector.detectChanges();
  }

  private updateMapHeight(): void {
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

  private getRadiusFromBounds(): number {
    return (
      (this.map.map.getBounds().getEast() -
        this.map.map.getBounds().getWest()) *
      100
    );
  }
}
