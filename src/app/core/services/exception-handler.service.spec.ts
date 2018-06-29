import { TestBed, inject } from '@angular/core/testing';

import { ExceptionHandler } from './exception-handler.service';

describe('ExceptionHandler', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExceptionHandler],
    });
  });

  it('should be created', inject(
    [ExceptionHandler],
    (service: ExceptionHandler) => {
      expect(service).toBeTruthy();
    }
  ));
});
