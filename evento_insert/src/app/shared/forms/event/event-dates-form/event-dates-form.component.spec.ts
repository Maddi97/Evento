import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDatesFormComponent } from './event-dates-form.component';

describe('EventDatesFormComponent', () => {
  let component: EventDatesFormComponent;
  let fixture: ComponentFixture<EventDatesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventDatesFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventDatesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
