import {
  TestBed,
  ComponentFixture,
  waitForAsync,
  ComponentFixtureAutoDetect,
  inject,
} from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { EventsComponent } from "./events.component";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { BehaviorSubject } from "rxjs";
import { HttpClientModule } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { NgZone } from "@angular/core";

// Mocking platformId
const platformId = new BehaviorSubject<Object>("browser");

describe("EventsComponent", () => {
  let component: EventsComponent;
  let fixture: ComponentFixture<EventsComponent>;
  const fakeActivatedRoute = {
    snapshot: { data: {} },
  } as ActivatedRoute;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EventsComponent],
      imports: [
        CommonModule,
        FormsModule,
        MatIconModule,
        NgxSpinnerModule,
        HttpClientModule,
      ],
      providers: [
        NgxSpinnerService,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: "PLATFORM_ID", useValue: platformId },
        { provide: ComponentFixtureAutoDetect, useValue: true },
        {
          provide: NgZone,
          useValue: new NgZone({ enableLongStackTrace: false }),
        }, // Configure NgZone
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it("should create the component", waitForAsync(() => {
    expect(component).toBeTruthy();
  }));

  it("should initialize with default values", () => {
    expect(component.isDropdown).toBeFalse();
    // add more expectations for other default values if needed
  });

  // Add more tests as per the requirements
});
