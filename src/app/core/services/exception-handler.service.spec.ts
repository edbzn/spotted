import { TestBed, inject } from '@angular/core/testing';
import { ExceptionHandler } from './exception.handler.service';
import { TestModule } from 'src/test.module.spec';

describe('ExceptionHandler', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExceptionHandler],
      imports: [TestModule],
    });
  });

  it('should be created', inject(
    [ExceptionHandler],
    (service: ExceptionHandler) => {
      expect(service).toBeTruthy();
    }
  ));
});
