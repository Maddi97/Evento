import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryAliasFormComponent } from './category-alias-form.component';

describe('CategoryAliasFormComponent', () => {
  let component: CategoryAliasFormComponent;
  let fixture: ComponentFixture<CategoryAliasFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryAliasFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoryAliasFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
