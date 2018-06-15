import {
  latLng,
  LatLng,
  Layer,
  tileLayer,
  Map,
  MapOptions,
  Point,
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
import {
  distinctUntilChanged,
  debounceTime,
  switchMap,
  catchError,
  filter,
} from 'rxjs/internal/operators';

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
   * Emit the Point where user clicked to center the map on it
   */
  @Output() pointAdded: EventEmitter<Point> = new EventEmitter<Point>();

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
  layers: Layer[] = [
    tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: this.maxZoom,
    }),
  ];

  /**
   * Map options
   */
  options: MapOptions = {
    layers: this.layers,
    zoom: this.zoom,
    center: latLng(this.lat, this.lng),
    tap: true,
    zoomControl: false,
  };

  /**
   * Map layers control
   */
  layersControl = {};

  /**
   * Lat & Long computed user to center Leaflet map
   */
  get center(): LatLng {
    return latLng(this.lat, this.lng);
  }

  constructor(@Inject(WINDOW) private window: Window) {}

  ngOnInit() {
    this.tryBrowserGeoLocalization();
  }

  onMapReady(map: Map): void {
    this.map = map;
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
    const latitudeLongitude = this.map.containerPointToLatLng(this.point);
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
