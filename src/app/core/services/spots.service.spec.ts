import { TestBed, inject } from '@angular/core/testing';

import { SpotsService } from './spots.service';
import { TestModule } from '../../../test.module.spec';

describe('SpotsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [SpotsService],
    });
  });

  it('should be created', inject([SpotsService], (service: SpotsService) => {
    expect(service).toBeTruthy();
  }));
});
