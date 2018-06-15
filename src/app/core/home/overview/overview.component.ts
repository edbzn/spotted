import { LatLng } from 'leaflet';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpotsService } from '../../spots.service';
import { Api } from '../../../../types/api';

@Component({
  selector: 'spt-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  spotForm: FormGroup;

  selectedTab = 0;

  get valid(): boolean {
    return this.spotForm.valid;
  }

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
      tags: this.fb.array([]),
      disciplines: this.fb.array([]),
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
    const { value } = this.spotForm;
    this.spotsService.add({ id: 1, ...value });
    this.spotForm.reset();
  }

  trackByFn(i: number, spot: Api.Spot): string {
    return spot.id;
  }

  activeSpotTab(): void {
    this.selectedTab = 1;
  }

  fillSpotForm(latLng: LatLng): void {
    this.spotForm.patchValue({
      location: { latitude: latLng.lat, longitude: latLng.lng },
    });
  }
}
