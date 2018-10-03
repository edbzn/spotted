import { TestBed, inject } from '@angular/core/testing';

import { StorageService } from './storage.service';
import { TestModule } from 'src/test.module.spec';

describe('StorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [StorageService],
    });
  });

  it('should be created', inject(
    [StorageService],
    (service: StorageService) => {
      expect(service).toBeTruthy();
    }
  ));
});
