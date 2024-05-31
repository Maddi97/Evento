import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryEventExpansionPanelComponent } from './category-event-expansion-panel.component';

describe('CategoryEventExpansionPanelComponent', () => {
  let component: CategoryEventExpansionPanelComponent;
  let fixture: ComponentFixture<CategoryEventExpansionPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryEventExpansionPanelComponent]
    });
    fixture = TestBed.createComponent(CategoryEventExpansionPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
