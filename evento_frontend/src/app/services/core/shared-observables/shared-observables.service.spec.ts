import { TestBed } from "@angular/core/testing";

import { SharedObservableService } from "./shared-observables.service";

describe("SharedObservablesService", () => {
  let service: SharedObservableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedObservableService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
