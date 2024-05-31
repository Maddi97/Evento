import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventFeatureFlagsFormComponent } from './event-feature-flags-form.component';

describe('EventFeatureFlagsFormComponent', () => {
  let component: EventFeatureFlagsFormComponent;
  let fixture: ComponentFixture<EventFeatureFlagsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventFeatureFlagsFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EventFeatureFlagsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
