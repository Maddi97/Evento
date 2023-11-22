import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrawlEventsComponent } from './crawl-events.component';

describe('CrawlEventsComponent', () => {
  let component: CrawlEventsComponent;
  let fixture: ComponentFixture<CrawlEventsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrawlEventsComponent]
    });
    fixture = TestBed.createComponent(CrawlEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
