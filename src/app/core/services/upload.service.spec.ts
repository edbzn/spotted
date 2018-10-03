import { TestModule } from './../../../test.module.spec';
import { TestBed, inject } from '@angular/core/testing';

import { UploadService } from './upload.service';

describe('UploadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [UploadService],
    });
  });

  it('should be created', inject([UploadService], (service: UploadService) => {
    expect(service).toBeTruthy();
  }));
});
