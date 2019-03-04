import { TestBed } from '@angular/core/testing';

import { NaiveService } from './naive.service';

describe('NaiveService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NaiveService = TestBed.get(NaiveService);
    expect(service).toBeTruthy();
  });
});
