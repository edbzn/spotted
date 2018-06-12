import {
  distinctUntilChanged,
  debounceTime,
  switchMap,
  catchError,
} from 'rxjs/internal/operators';
import { Component, OnInit, Inject, Optional } from '@angular/core';
import { WINDOW } from 'src/app/core/window.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { empty, Observable, Subscription, observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiMockClient } from '../../../api-client-mock.service';
import { tileLayer, latLng } from 'leaflet';

@Component({
  selector: 'spt-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  public zoom = 3;
  public lat = 100;
  public lng = 100;

  public searchForm: FormGroup;
  private formChange$: Subscription;

  options = {
    layers: [
      tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '...',
      }),
    ],
    zoom: 5,
    center: latLng(this.lat, this.lng),
  };

  constructor(
    @Inject(WINDOW) private window: Window,
    @Optional() private apiMock: ApiMockClient,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.createSearchForm();

    this.setPosition(this.lat, this.lng);

    this.tryGeoloc();

    this.formChange$ = this.searchForm.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(200),
        switchMap(formValue => {
          return this.apiMock.get(formValue.query);
        })
      )
      .subscribe(console.log);
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

  private createSearchForm(): void {
    this.searchForm = this.fb.group({
      query: '',
    });
  }

  private setPosition(latitude: number, longitude: number): void {
    this.lat = latitude;
    this.lng = longitude;
    this.zoom = 12;
  }
}
