import { TestBed, inject } from '@angular/core/testing';
import { AuthService } from '../../authentication/auth.service';
import { offlineAuthServiceStub } from 'src/app/authentication/auth.fake-auth.service.spec';
import { ErrorHandler } from '@angular/core';

describe('ExceptionHandler', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: offlineAuthServiceStub },
        { provide: ErrorHandler, useClass: ErrorHandler },
      ],
    });
  });

  it('Correctly print errors in development', inject(
    [ErrorHandler],
    (service: ErrorHandler) => {
      const spy = spyOn(console, 'error');
      const error: Error = new Error('An exception message');
      service.handleError(error);
      expect(spy).toHaveBeenCalledWith('ERROR', error);
    }
  ));
});
