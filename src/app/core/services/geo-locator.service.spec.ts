import { TestBed } from '@angular/core/testing';

import { GeoLocatorService } from './geo-locator.service';
import { TestModule } from 'src/test.module.spec';

describe('GeoLocatorService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [TestModule],
    }));

  it('should be created', () => {
    const service: GeoLocatorService = TestBed.get(GeoLocatorService);
    expect(service).toBeTruthy();
  });
});
