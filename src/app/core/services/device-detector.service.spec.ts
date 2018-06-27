import { TestBed, inject } from '@angular/core/testing';

import { DeviceDetectorService } from './device-detector.service';

describe('DeviceDetectorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeviceDetectorService]
    });
  });

  it('should be created', inject([DeviceDetectorService], (service: DeviceDetectorService) => {
    expect(service).toBeTruthy();
  }));
});
