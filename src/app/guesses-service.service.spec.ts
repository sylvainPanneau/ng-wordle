import { TestBed } from '@angular/core/testing';

import { GuessesServiceService } from './guesses-service.service';

describe('GuessesServiceService', () => {
  let service: GuessesServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuessesServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
