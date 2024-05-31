import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerAdditionalInfoFormComponent } from './organizer-additional-info-form.component';

describe('OrganizerAdditionalInfoFormComponent', () => {
  let component: OrganizerAdditionalInfoFormComponent;
  let fixture: ComponentFixture<OrganizerAdditionalInfoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerAdditionalInfoFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrganizerAdditionalInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
