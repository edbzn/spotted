import {
  distinctUntilChanged,
  debounceTime,
  switchMap,
  catchError,
  filter,
} from 'rxjs/internal/operators';
import { Component, OnInit, Inject, Optional } from '@angular/core';
import { WINDOW } from 'src/app/core/window.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { empty, Observable, Subscription, observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tileLayer, latLng, polygon, circle, LatLng, Layer } from 'leaflet';
import { SpotsService } from '../../spots.service';

@Component({
  selector: 'spt-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  public searchForm: FormGroup;
  private formChange$: Subscription;

  public zoom = 10;
  public maxZoom = 20;

  public lat = 46.879966;
  public lng = -121.726909;

  public layers: Layer[] = [
    tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: this.maxZoom,
    }),
  ];

  public options = {
    layers: this.layers,
    zoom: this.zoom,
    center: latLng(this.lat, this.lng),
  };

  public layersControl = {};

  get center(): LatLng {
    return latLng(this.lat, this.lng);
  }

  constructor(
    @Inject(WINDOW) private window: Window,
    private fb: FormBuilder,
    private spotsService: SpotsService
  ) {}

  ngOnInit() {
    this.tryGeoloc();
  }

  private tryGeoloc(): void {
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
