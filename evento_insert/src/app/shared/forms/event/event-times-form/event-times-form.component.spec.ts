import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTimesFormComponent } from './event-times-form.component';

describe('EventTimesFormComponent', () => {
  let component: EventTimesFormComponent;
  let fixture: ComponentFixture<EventTimesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventTimesFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventTimesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
