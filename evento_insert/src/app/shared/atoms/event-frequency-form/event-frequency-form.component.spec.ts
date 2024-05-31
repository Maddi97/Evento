import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventFrequencyFormComponent } from './event-frequency-form.component';

describe('EventFrequencyFormComponent', () => {
  let component: EventFrequencyFormComponent;
  let fixture: ComponentFixture<EventFrequencyFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventFrequencyFormComponent]
    });
    fixture = TestBed.createComponent(EventFrequencyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
