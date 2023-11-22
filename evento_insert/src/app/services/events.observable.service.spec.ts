import { TestBed } from '@angular/core/testing';

import { EventsObservableService } from './events.observable.service';

describe('EventsObservableService', () => {
  let service: EventsObservableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventsObservableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
