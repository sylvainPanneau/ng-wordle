import { TestBed } from '@angular/core/testing';

import { GameDbServiceService } from './game-db-service.service';

describe('GameDbServiceService', () => {
  let service: GameDbServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameDbServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
