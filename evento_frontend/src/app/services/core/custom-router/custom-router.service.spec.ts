import { TestBed } from '@angular/core/testing';

import { CustomRouterService } from './custom-router.service';

describe('CustomRouterService', () => {
  let service: CustomRouterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomRouterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
