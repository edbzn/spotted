import { TestModule } from 'src/test.module.spec';
import { TestBed, inject } from '@angular/core/testing';

import { PushService } from './push.service';

describe('PushService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [PushService],
    });
  });

  it('should be created', inject([PushService], (service: PushService) => {
    expect(service).toBeTruthy();
  }));
});
