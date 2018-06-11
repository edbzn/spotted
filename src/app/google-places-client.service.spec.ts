import { TestBed, inject } from '@angular/core/testing';

import { GooglePlacesClientService } from './google-places-client.service';

describe('GooglePlacesClientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GooglePlacesClientService]
    });
  });

  it('should be created', inject([GooglePlacesClientService], (service: GooglePlacesClientService) => {
    expect(service).toBeTruthy();
  }));
});
