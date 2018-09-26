import { TestBed } from '@angular/core/testing';

import { UserLocatorService } from './user-locator.service';

describe('UserLocatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserLocatorService = TestBed.get(UserLocatorService);
    expect(service).toBeTruthy();
  });
});
