import { TestBed } from '@angular/core/testing';

import { MapCenterViewService } from './map-center-view.service';

describe('MapCenterViewService', () => {
  let service: MapCenterViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MapCenterViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
