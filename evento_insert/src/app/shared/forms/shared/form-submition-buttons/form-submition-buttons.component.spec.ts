import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSubmitionButtonsComponent } from './form-submition-buttons.component';

describe('FormSubmitionButtonsComponent', () => {
  let component: FormSubmitionButtonsComponent;
  let fixture: ComponentFixture<FormSubmitionButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSubmitionButtonsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormSubmitionButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
