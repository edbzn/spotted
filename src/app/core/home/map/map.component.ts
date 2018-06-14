import {
  circle,
  latLng,
  LatLng,
  Layer,
  polygon,
  tileLayer,
  Map,
} from 'leaflet';
import {
  Component,
  Inject,
  OnInit,
  Optional,
  ViewChild,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { empty, Observable, observable, Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatMenuTrigger } from '@angular/material';
import { SpotsService } from '../../spots.service';
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
  options = {
    layers: this.layers,
    zoom: this.zoom,
    center: latLng(this.lat, this.lng),
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

  constructor(
    @Inject(WINDOW) private window: Window,
    private fb: FormBuilder,
    private spotsService: SpotsService
  ) {}

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
      this.matMenu.openMenu();
    }
  }

  addSpot(event: Event): void {
    this.spotAdded.emit(this.map.getCenter());
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
  }
}
