import { TestBed } from '@angular/core/testing';

import { OAuthLoginServiceService } from './oauth-login-service.service';

describe('OAuthLoginServiceService', () => {
  let service: OAuthLoginServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OAuthLoginServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
