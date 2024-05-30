import { TestBed } from '@angular/core/testing';

import { StoreDatasetService } from './store-dataset.service';

describe('StoreDatasetService', () => {
  let service: StoreDatasetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreDatasetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
