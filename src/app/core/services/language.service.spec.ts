import { TestModule } from './../../../test.module.spec';
import { TestBed, inject } from '@angular/core/testing';

import { LanguageService } from './language.service';

describe('LanguageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestModule],
      providers: [LanguageService],
    });
  });

  it('should be created', inject(
    [LanguageService],
    (service: LanguageService) => {
      expect(service).toBeTruthy();
    }
  ));
});
