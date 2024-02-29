import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpeningTimesFormComponent } from './opening-times-form.component';

describe('OpeningTimesFormComponent', () => {
  let component: OpeningTimesFormComponent;
  let fixture: ComponentFixture<OpeningTimesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpeningTimesFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OpeningTimesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
