import { LatLng } from 'leaflet';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { SpotsService } from '../../spots.service';
import { Api } from '../../../../types/api';
import { MatStepper } from '@angular/material';
import { UploadService } from '../../upload.service';
import { GeocoderService } from '../../geocoder.service';
import { Subject } from 'rxjs';
import {
  flatMap,
  tap,
  distinctUntilChanged,
  debounceTime,
} from 'rxjs/internal/operators';

@Component({
  selector: 'spt-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  /**
   * Form ref
   */
  spotForm: FormGroup;

  /**
   * Stepper ref
   */
  stepper: MatStepper;

  /**
   * Tap index
   */
  selectedTab = 0;

  /**
   * Disciplines used in form select
   * @todo move it in a config provider with dynamic mapping
   */
  disciplines: Api.Disciplines[] = ['BMX', 'roller', 'skate'];

  /**
   * Spot types used in form select
   * @todo move it in a config provider with dynamic mapping
   */
  types: Api.Type[] = ['bowl', 'dirt', 'park', 'street', 'street-park'];

  /**
   * Emit the newly created spot to remove helper marker on the map
   */
  @Output()
  spotFormSubmitted: EventEmitter<Api.Spot> = new EventEmitter<Api.Spot>();

  /**
   * Uploaded pictures
   */
  pictures: string[] = [];

  /**
   *
   */
  fillSpotFormHandler = new Subject<LatLng>();

  /**
   * Form valid
   */
  get valid(): boolean {
    return this.spotForm.valid;
  }

  /**
   * Form touched
   */
  get dirty(): boolean {
    return this.spotForm.dirty;
  }

  get location(): FormGroup {
    return this.spotForm.get('location') as FormGroup;
  }

  get media(): FormGroup {
    return this.spotForm.get('media') as FormGroup;
  }

  constructor(
    private fb: FormBuilder,
    private googlePlaces: GeocoderService,
    public spotsService: SpotsService,
    public upload: UploadService
  ) {}

  ngOnInit() {
    this.spotForm = this.fb.group({
      name: '',
      description: '',
      difficulty: '',
      type: ['', Validators.required],
      disciplines: [[], Validators.required],
      location: this.fb.group({
        address: ['', Validators.required],
        placeId: [''],
        latitude: ['', Validators.required],
        longitude: ['', Validators.required],
      }),
      media: this.fb.group({
        pictures: [[], Validators.required],
        videos: [[]],
      }),
    });

    this.fillSpotFormHandler
      .pipe(
        tap(latLng => {
          this.location.patchValue({
            latitude: latLng.lat,
            longitude: latLng.lng,
          });
        }),
        distinctUntilChanged(),
        debounceTime(400),
        flatMap(latLng => this.googlePlaces.search(latLng)),
        tap(results => {
          const nearest = results[0];
          const address = nearest.formatted_address;
          const placeId = nearest.place_id;

          this.location.patchValue({ address, placeId });
        })
      )
      .subscribe();
  }

  createSpot(): void {
    if (!this.valid) {
      return;
    }

    const { value } = this.spotForm;
    const spot: Api.Spot = { id: 1, ...value }; // <- temporary id overwritten in SpotService
    this.spotsService.add(spot);
    this.spotFormSubmitted.emit(spot);
    this.reset();
  }

  trackByFn(i: number, spot: Api.Spot): string {
    return spot.id;
  }

  activateSpotTab(): void {
    this.selectedTab = 1;
  }

  fillSpotForm(latLng: LatLng): void {
    this.fillSpotFormHandler.next(latLng);
  }

  onFileAdded(event: Event): void {
    this.upload.file(event).subscribe(path => {
      this.pictures.push(path);
      this.media.get('pictures').setValue(this.pictures);
    });
  }

  reset(): void {
    this.pictures = [];
    this.spotForm.reset();
  }
}
