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
import { tileLayer, latLng } from 'leaflet';
import { SpotsService } from '../../spots.service';

@Component({
  selector: 'spt-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  public searchForm: FormGroup;
  private formChange$: Subscription;

  public zoom = 3;
  public lat = 100;
  public lng = 100;
  public options = {
    zoom: 18,
    center: latLng(this.lat, this.lng),
    altitude: 100,
  };

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
    this.zoom = 12;

    this.options = {
      zoom: this.zoom,
      center: latLng(this.lat, this.lng),
      altitude: 100,
    };
  }
}
