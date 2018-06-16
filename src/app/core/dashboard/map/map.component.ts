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
  Icon,
  latLng,
  DragEndEvent,
  LeafletEvent,
  LeafletMouseEvent,
} from 'leaflet';
import {
  Component,
  Inject,
  OnInit,
  ViewChild,
  EventEmitter,
  Output,
} from '@angular/core';
import { MatMenuTrigger } from '@angular/material';
import { WINDOW } from 'src/app/core/window.service';
import { tap } from 'rxjs/internal/operators';
import { SpotsService } from '../../spots.service';

@Component({
  selector: 'spt-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
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
  @ViewChild(MatMenuTrigger) matMenu: MatMenuTrigger;

  /**
   * Emit the Lat & Lng to create a Spot at the click position
   */
  @Output() spotAdded: EventEmitter<LatLng> = new EventEmitter<LatLng>();

  /**
   * The last Point to emit
   */
  point: Point;

  /**
   * Map zoom
   */
  zoom = 13;

  /**
   * Max zoom that can be reached
   */
  maxZoom = 20;

  /**
   * Latitude
   */
  lat = 46.879966;

  /**
   * Longitude
   */
  lng = -121.726909;

  /**
   * Map layers
   */
  layers: Layer[] = [];

  /**
   * Gmap tile Layer
   */
  googleMaps: Layer = tileLayer(
    'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      detectRetina: true,
    }
  );

  /**
   * Gmap street tile Layer
   */
  googleHybrid: Layer = tileLayer(
    'http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',
    {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      detectRetina: true,
    }
  );

  /**
   * Icon config for markers
   */
  iconConfig: IconOptions = {
    iconSize: [30, 30],
    iconAnchor: [30, 30],
    iconUrl: 'assets/images/std-spot-marker.png',
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
    center: this.center,
    tap: true,
    zoomControl: false,
  };

  /**
   * Keep markers by spots to only append new marker when spot changes
   */
  spotsMarked: string[] = [];

  /**
   * Help marker ref to ensure only one is present
   */
  helpMarker: Layer;

  /**
   * Lat & Long computed user to center Leaflet map
   */
  get center(): LatLng {
    return latLng(this.lat, this.lng);
  }

  constructor(
    @Inject(WINDOW) private window: Window,
    private spotsService: SpotsService
  ) {}

  ngOnInit() {
    this.tryBrowserGeoLocalization();
  }

  onMapReady(map: Map): void {
    this.map = map;

    // bind spots to marker creation on the map
    this.spotsService.spots
      .pipe(
        tap(spots => {
          spots.forEach(spot => {
            const latitudeLongitude = new LatLng(
              spot.location.latitude,
              spot.location.longitude
            );
            const layer = marker(latitudeLongitude, {
              icon: icon(this.iconConfig),
            });

            if (!this.spotsMarked.includes(latitudeLongitude.toString())) {
              this.spotsMarked.push(latitudeLongitude.toString());
              this.map.addLayer(layer);
            }
          });
        })
      )
      .subscribe();
  }

  onMapClick(event: MouseEvent): void {
    event.preventDefault();

    if (event instanceof MouseEvent) {
      this.mouseY = event.offsetY;
      this.mouseX = event.offsetX;
      this.point = new Point(this.mouseX, this.mouseY);
      this.matMenu.openMenu();
    }
  }

  addSpot(): void {
    // ensure one help marker is present at a time
    if (this.helpMarker) {
      this.map.removeLayer(this.helpMarker);
    }

    const latitudeLongitude = this.map.containerPointToLatLng(this.point);
    const helpMarkerOptions: IconOptions = {
      ...this.iconConfig,
      iconUrl: 'assets/images/create-spot-marker.png',
    };

    // create help marker
    const helpMarker = marker(latitudeLongitude, {
      icon: icon(helpMarkerOptions),
      draggable: true,
      title: 'helpMarker',
    });

    // bind marker drag event to the spot creation form
    helpMarker.on('drag', (event: LeafletMouseEvent) => {
      if (event.hasOwnProperty('latlng')) {
        this.spotAdded.emit(latLng(event.latlng.lat, event.latlng.lng));
      }
    });

    this.helpMarker = helpMarker;
    this.map.addLayer(helpMarker);
    this.spotAdded.emit(latitudeLongitude);
    this.map.flyTo(latitudeLongitude);
  }

  private tryBrowserGeoLocalization(): void {
    const { navigator } = this.window;

    // Try HTML5 geolocation.
    if (navigator && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          this.setPosition(latitude, longitude);
        },
        () => {
          // @todo center map, handle error
        }
      );
    } else {
      // Browser doesn't support Geolocation
      // @todo center map, handle error
    }
  }

  private setPosition(latitude: number, longitude: number): void {
    this.lat = latitude;
    this.lng = longitude;

    this.map.flyTo(new LatLng(this.lat, this.lng), this.zoom, {
      duration: this.mapMoveDuration,
    });
  }
}
