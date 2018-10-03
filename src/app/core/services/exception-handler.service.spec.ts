import { TestBed, inject } from '@angular/core/testing';
import { ExceptionHandler } from './exception.handler.service';
import { TestModule } from 'src/test.module.spec';
import { AuthService } from '../../authentication/auth.service';
import { offlineAuthServiceStub } from 'src/app/authentication/auth.fake-auth.service.spec';
import { ErrorHandler } from '@angular/core';

describe('ExceptionHandler', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: offlineAuthServiceStub },
        { provide: ErrorHandler, useClass: ExceptionHandler },
      ],
    });
  });

  it('Correctly handles error', inject(
    [ErrorHandler],
    (service: ErrorHandler) => {
      const spy = spyOn(console, 'error');
      const error: Error = new Error('ERROR');
      service.handleError(error);
      expect(spy).toHaveBeenCalledWith(error);
    }
  ));
});
