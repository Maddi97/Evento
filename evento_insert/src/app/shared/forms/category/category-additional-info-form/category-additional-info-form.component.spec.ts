import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryAdditionalInfoFormComponent } from './category-additional-info-form.component';

describe('CategoryAdditionalInfoFormComponent', () => {
  let component: CategoryAdditionalInfoFormComponent;
  let fixture: ComponentFixture<CategoryAdditionalInfoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryAdditionalInfoFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoryAdditionalInfoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
