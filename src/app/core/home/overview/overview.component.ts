import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

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

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.createSpotForm = this.fb.group({
      name: '',
      difficulty: '',
      tags: this.fb.array([]),
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
}
