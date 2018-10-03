import { TestModule } from './../../../test.module.spec';
import { TestBed, inject } from '@angular/core/testing';

import { DeviceDetectorService } from './device-detector.service';

describe('DeviceDetectorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [DeviceDetectorService],
    });
  });

  it('should be created', inject(
    [DeviceDetectorService],
    (service: DeviceDetectorService) => {
      expect(service).toBeTruthy();
    }
  ));
});
