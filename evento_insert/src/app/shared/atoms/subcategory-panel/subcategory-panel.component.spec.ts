import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcategoryPanelComponent } from './subcategory-panel.component';

describe('SubcategoryPanelComponent', () => {
  let component: SubcategoryPanelComponent;
  let fixture: ComponentFixture<SubcategoryPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubcategoryPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubcategoryPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
