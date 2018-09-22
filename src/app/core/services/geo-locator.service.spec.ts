import { TestBed } from '@angular/core/testing';

import { GeoLocatorService } from './geo-locator.service';

describe('GeoLocatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GeoLocatorService = TestBed.get(GeoLocatorService);
    expect(service).toBeTruthy();
  });
});
