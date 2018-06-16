import { LatLng } from 'leaflet';
import { Component, OnInit, ViewRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpotsService } from '../../spots.service';
import { Api } from '../../../../types/api';
import { MatStepper } from '@angular/material';

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

  constructor(private fb: FormBuilder, public spotsService: SpotsService) {}

  ngOnInit() {
    this.spotForm = this.fb.group({
      name: '',
      description: '',
      difficulty: '',
      type: ['', Validators.required],
      disciplines: [[], Validators.required],
      location: this.fb.group({
        address: ['', Validators.required],
        city: ['', Validators.required],
        postalCode: ['', Validators.required],
        country: ['', Validators.required],
        latitude: ['', Validators.required],
        longitude: ['', Validators.required],
      }),
      media: this.fb.group({
        pictures: this.fb.array([]),
        videos: this.fb.array([]),
      }),
    });
  }

  createSpot(): void {
    if (!this.valid) {
      return;
    }

    const { value } = this.spotForm;
    this.spotsService.add({ id: 1, ...value }); // <- temporary id overwritten in SpotService
    this.spotForm.reset();
  }

  trackByFn(i: number, spot: Api.Spot): string {
    return spot.id;
  }

  activateSpotTab(): void {
    this.selectedTab = 1;
  }

  fillSpotForm(latLng: LatLng): void {
    this.spotForm.patchValue({
      location: { latitude: latLng.lat, longitude: latLng.lng },
    });
  }
}
