import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryExpansionPanelComponent } from './category-expansion-panel.component';

describe('CategoryExpansionPanelComponent', () => {
  let component: CategoryExpansionPanelComponent;
  let fixture: ComponentFixture<CategoryExpansionPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryExpansionPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoryExpansionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
