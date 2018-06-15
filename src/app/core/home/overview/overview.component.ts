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
  searchForm: FormGroup;
  createSpotForm: FormGroup;

  selectedTab = 0;

  get valid(): boolean {
    return this.createSpotForm.valid;
  }

  get dirty(): boolean {
    return this.createSpotForm.dirty;
  }

  get locationForm(): FormGroup {
    return this.createSpotForm.get('location') as FormGroup;
  }

  constructor(private fb: FormBuilder, public spotsService: SpotsService) {}

  ngOnInit() {
    this.createSpotForm = this.fb.group({
      name: '',
      difficulty: '',
      tags: this.fb.array([]),
      disciplines: this.fb.array([]),
      pictures: this.fb.array([]),
      videos: this.fb.array([]),
      location: this.fb.group({
        address: ['', Validators.required],
        city: ['', Validators.required],
        postalCode: ['', Validators.required],
        country: ['', Validators.required],
        latitude: ['', Validators.required],
        longitude: ['', Validators.required],
      }),
    });

    this.searchForm = this.fb.group({
      query: '',
    });
  }

  createSpot(): void {
    const spot = { ...this.createSpotForm.value, id: 1 } as Api.Spot;
    this.spotsService.add(spot);
  }

  trackByFn(i: number, spot: Api.Spot): string {
    return spot.id;
  }

  activeSpotTab(): void {
    this.selectedTab = 1;
  }

  fillSpotForm(latLng: LatLng): void {
    this.createSpotForm.patchValue({
      location: { latitude: latLng.lat, longitude: latLng.lng },
    });
  }
}
