import { TestBed } from '@angular/core/testing';

import { GeoSpotsService } from './geo-spots.service';

describe('GeoSpotsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GeoSpotsService = TestBed.get(GeoSpotsService);
    expect(service).toBeTruthy();
  });
});
