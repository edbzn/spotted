import { TestModule } from 'src/test.module.spec';
import { TestBed } from '@angular/core/testing';

import { GeoSpotsService } from './geo-spots.service';

describe('GeoSpotsService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [TestModule],
    }));

  it('should be created', () => {
    const service: GeoSpotsService = TestBed.get(GeoSpotsService);
    expect(service).toBeTruthy();
  });
});
