import { TestBed } from '@angular/core/testing';

import { SharedObservablesService } from './shared-observables.service';

describe('SharedObservablesService', () => {
  let service: SharedObservablesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedObservablesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
