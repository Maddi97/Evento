import { TestBed } from '@angular/core/testing';

import { OrganizerObservableService } from './organizer.observable.service';

describe('OrganizerObservableService', () => {
  let service: OrganizerObservableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrganizerObservableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
