import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SpotsService } from '../../spots.service';
import { Api } from '../../../../types/api';

@Component({
  selector: 'spt-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  createSpotForm: FormGroup;

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
        address: '',
        city: '',
        postalCode: null,
        country: '',
        latitude: null,
        longitude: null,
      }),
    });
  }

  createSpot(): void {
    const spot = { ...this.createSpotForm.value, id: 1 } as Api.Spot;
    this.spotsService.add(spot);
  }

  trackByFn(i: number, spot: Api.Spot): string {
    return spot.id;
  }
}
