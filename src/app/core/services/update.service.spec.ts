import { TestBed } from '@angular/core/testing';

import { UpdateService } from './update.service';
import { TestModule } from '../../../test.module.spec';

describe('UpdateService', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [TestModule],
    }));

  it('should be created', () => {
    const service: UpdateService = TestBed.get(UpdateService);
    expect(service).toBeTruthy();
  });
});
