import { TestBed } from '@angular/core/testing';

import { SpotLocatorService } from './spot-locator.service';

describe('SpotLocatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SpotLocatorService = TestBed.get(SpotLocatorService);
    expect(service).toBeTruthy();
  });
});
