import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventAdditionalInformationFormComponent } from './event-additional-information-form.component';

describe('EventAdditionalInformationFormComponent', () => {
  let component: EventAdditionalInformationFormComponent;
  let fixture: ComponentFixture<EventAdditionalInformationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventAdditionalInformationFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventAdditionalInformationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
