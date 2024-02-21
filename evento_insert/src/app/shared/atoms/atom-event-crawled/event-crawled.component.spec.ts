import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCrawledComponent } from './event-crawled.component';

describe('EventCrawledComponent', () => {
  let component: EventCrawledComponent;
  let fixture: ComponentFixture<EventCrawledComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventCrawledComponent]
    });
    fixture = TestBed.createComponent(EventCrawledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
