import { TestBed } from '@angular/core/testing';

import { EventsComplexService } from './events.complex.service';

describe('EventsComplexService', () => {
  let service: EventsComplexService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventsComplexService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
