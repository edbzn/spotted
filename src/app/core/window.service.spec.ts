import { WINDOW, WINDOW_PROVIDERS } from './window.service';
import { TestBed, inject } from '@angular/core/testing';

describe('WINDOW', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [WINDOW_PROVIDERS] });
  });

  it('should be created', inject([WINDOW], (service: Window) => {
    expect(service).toBeTruthy();
  }));
});
