import { AuthService } from './../../../authentication/auth.service';
import {
  LatLng,
  Layer,
  tileLayer,
  Map,
  MapOptions,
  Point,
  marker,
  icon,
  IconOptions,
  latLng,
  LeafletMouseEvent,
  popup,
  LeafletEvent,
} from 'leaflet';
import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  EventEmitter,
  Output,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnChanges,
  Input,
  SimpleChanges,
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { WINDOW } from '../../../core/services/window.service';
import { Api } from 'src/types/api';
import { appConfiguration } from '../../../app-config';

@Component({
  selector: 'spt-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnInit, OnChanges, OnDestroy {
  /**
   * Spots displayed
   */
  @Input()
  spots: Api.Spot[];

  /**
   * Map ref
   */
  map: Map;

  /**
   * Animation duration when flying to a point (in s)
   */
  mapMoveDuration = 1;

  /**
   * Display the map menu with right X position
   */
  mouseX: number;

  /**
   * Display the map menu with right Y position
   */
  mouseY: number;

  /**
   * Menu displayed on the map when clicking
   */
  @ViewChild(MatMenuTrigger)
  matMenu: MatMenuTrigger;

  /**
   * Emit the Lat & Lng to create a Spot at the click position
   */
  @Output()
  helpMarkerChanged: EventEmitter<LatLng> = new EventEmitter<LatLng>();

  /**
   * Emit the spot when clicked to show it in overview
   */
  @Output()
  spotClicked: EventEmitter<Api.Spot> = new EventEmitter<Api.Spot>();

  /**
   * Emit when map is ready
   */
  @Output()
  mapReady: EventEmitter<Map> = new EventEmitter<Map>();

  /**
   * The last Point to emit
   */
  point: Point;

  /**
   * Map zoom
   */
  zoom = appConfiguration.map.zoom;

  /**
   * Max zoom that can be reached
   */
  maxZoom = appConfiguration.map.maxZoom;

  /**
   * Latitude
   */
  lat = appConfiguration.map.latitude;

  /**
   * Longitude
   */
  lng = appConfiguration.map.longitude;

  /**
   * Map layers
   */
  layers: Layer[] = [];

  /**
   * Gmap tile Layer
   */
  googleMaps: Layer = tileLayer(
    'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    {
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      detectRetina: true,
    }
  );

  /**
   * Gmap street tile Layer
   */
  googleHybrid: Layer = tileLayer(
    'https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
    {
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      detectRetina: true,
    }
  );

  /**
   * Icon config for markers
   */
  iconConfig: IconOptions = {
    iconSize: [42, 42],
    iconAnchor: [42, 42],
    iconUrl: appConfiguration.map.spotIconUrl,
  };

  /**
   * Layers control object with our two base layers and the three overlay layers
   */
  layersControl = {
    baseLayers: {
      'Google Maps': this.googleMaps,
      'Google Street': this.googleHybrid,
    },
    overlays: {},
  };

  /**
   * Map options
   */
  options: MapOptions = {
    layers: [this.googleMaps],
    zoom: this.zoom,
    maxZoom: appConfiguration.map.maxZoom,
    minZoom: appConfiguration.map.minZoom,
    center: this.center,
    tap: true,
    zoomControl: false,
  };

  /**
   * Help marker ref to ensure only one is present
   */
  helpMarker: Layer | null = null;

  /**
   * Each click emit event to change UI for mobiles in parent component
   */
  mapInteracted = new EventEmitter<Event | LeafletEvent>();

  /**
   * Lat & Long computed
   */
  get center(): LatLng {
    return latLng(this.lat, this.lng);
  }

  constructor(
    @Inject(WINDOW) private window: Window,
    private changeDetector: ChangeDetectorRef,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.tryBrowserGeoLocalization();
  }

  ngOnDestroy(): void {
    this.map.remove();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.spots) {
      const { currentValue } = changes.spots;
      this.updateMarkers(currentValue);
    }
  }

  onMapReady(map: Map): void {
    this.map = map;
    this.mapReady.emit(map);

    // emit map interaction to resize dashboard layout
    // and update component value when map interacted
    this.map.on('zoomlevelschange move zoom', event => {
      this.mapInteracted.emit(event);

      const position = this.map.getCenter();
      this.lat = position.lat;
      this.lng = position.lng;
    });
  }

  /**
   * On right-click display mat menu
   */
  onMapContextClick(event: MouseEvent): void {
    event.preventDefault();

    if (!this.auth.authenticated) {
      return;
    }

    if (event instanceof MouseEvent) {
      this.mouseY = event.layerY;
      this.mouseX = event.layerX;
      this.point = new Point(this.mouseX, event.offsetY);
      this.matMenu.openMenu();
    }
  }

  /**
   * Add helper to create a Spot at the right location
   */
  addHelpMarker(): void {
    // ensure one help marker is present at a time
    if (this.helpMarker) {
      this.map.removeLayer(this.helpMarker);
      this.helpMarker = null;
    }

    const latitudeLongitude = this.map.containerPointToLatLng(this.point);
    const helpMarkerOptions: IconOptions = {
      ...this.iconConfig,
      iconUrl: appConfiguration.map.helpMarker,
    };

    // create help marker
    const helpMarker = marker(latitudeLongitude, {
      icon: icon(helpMarkerOptions),
      draggable: true,
      title: 'Add my spot here',
    });

    // bind marker drag event to the spot creation form
    helpMarker.on('drag', (event: LeafletMouseEvent) => {
      if (event.hasOwnProperty('latlng')) {
        const { lat, lng } = event.latlng;
        const latitudeLongitudeChange = latLng(lat, lng);
        this.helpMarkerChanged.emit(latitudeLongitudeChange);

        helpMarker.on('dragend', () => {
          this.setPosition(latLng(lat, lng));
        });
      }
    });

    this.helpMarker = helpMarker;
    this.map.addLayer(helpMarker);
    this.setPosition(latitudeLongitude);
    this.helpMarkerChanged.emit(latitudeLongitude);
  }

  removeHelpMarker(): void {
    if (this.helpMarker) {
      this.map.removeLayer(this.helpMarker);
      this.helpMarker = null;
    }
  }

  setPosition(latitudeLongitude: LatLng, zoom?: number): void {
    this.lat = latitudeLongitude.lat;
    this.lng = latitudeLongitude.lng;

    this.map.flyTo(this.center, zoom || this.map.getZoom(), {
      duration: this.mapMoveDuration,
      animate: true,
    });
  }

  private tryBrowserGeoLocalization(): void {
    const { navigator } = this.window;

    // Try HTML5 geolocation.
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          this.setPosition(latLng(latitude, longitude));
        },
        () => {
          this.setPosition(latLng(45.75, 4.85)); // Lyon by default
        }
      );
    } else {
      this.setPosition(latLng(45.75, 4.85)); // Lyon by default
    }
  }

  private updateMarkers(spots: Api.Spot[]): void {
    this.layers = this.mapSpotsToMarkers(spots);
    this.changeDetector.detectChanges();
  }

  private mapSpotsToMarkers(spots: Api.Spot[]): Layer[] {
    return spots.map(spot => {
      const { latitude, longitude } = spot.location;
      const location = latLng(latitude, longitude);

      const spotMarker = marker(location, {
        icon: icon({
          ...this.iconConfig,
          iconUrl: `assets/images/marker-${this.getMarkerColor(spot)}.png`,
        }),
        draggable: false,
        title: `${(spot.type as string).toUpperCase()} ${
          spot.location.address
        }`,
      });

      this.map.addLayer(spotMarker);

      spotMarker.on('click', (event: LeafletMouseEvent) => {
        popup({
          maxWidth: 1,
          minWidth: 1,
          maxHeight: 1,
          closeButton: false,
        })
          .setLatLng(event.latlng)
          .setPopupContent('<div class="spot-selected"></div>')
          .openOn(this.map);

        this.spotClicked.emit(spot);
      });

      return spotMarker;
    });
  }

  private getMarkerColor(spot: Api.Spot): string {
    let markerColor = 'gray';

    if (spot.type === 'bowl') {
      markerColor = 'blue';
    }
    if (spot.type === 'curb') {
      markerColor = 'cyan';
    }
    if (spot.type === 'dirt') {
      markerColor = 'red';
    }
    if (spot.type === 'park') {
      markerColor = 'violet';
    }
    if (spot.type === 'rail') {
      markerColor = 'green';
    }
    if (spot.type === 'ramp') {
      markerColor = 'brown';
    }
    if (spot.type === 'street-plaza') {
      markerColor = 'dark-blue';
    }

    return markerColor;
  }
}
