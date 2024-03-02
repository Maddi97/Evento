import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryImageComponent } from './category-image.component';

describe('CategoryImageComponent', () => {
  let component: CategoryImageComponent;
  let fixture: ComponentFixture<CategoryImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryImageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoryImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
