import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrawledEventsToEventComponent } from './crawled-events-to-event.component';

describe('CrawledEventsToEventComponent', () => {
  let component: CrawledEventsToEventComponent;
  let fixture: ComponentFixture<CrawledEventsToEventComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrawledEventsToEventComponent]
    });
    fixture = TestBed.createComponent(CrawledEventsToEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
