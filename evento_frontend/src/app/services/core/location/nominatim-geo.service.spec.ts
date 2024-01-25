import { TestBed } from '@angular/core/testing';

import { NominatimGeoService } from './nominatim-geo.service';

describe('NominatimGeoService', () => {
  let service: NominatimGeoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NominatimGeoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
