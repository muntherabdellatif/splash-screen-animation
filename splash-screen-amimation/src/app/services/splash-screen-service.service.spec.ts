import { TestBed } from '@angular/core/testing';

import { SplashScreenServiceService } from './splash-screen-service.service';

describe('SplashScreenServiceService', () => {
  let service: SplashScreenServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SplashScreenServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
