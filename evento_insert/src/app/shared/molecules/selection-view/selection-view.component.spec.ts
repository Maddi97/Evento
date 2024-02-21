import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionViewComponent } from './selection-view.component';

describe('SelectionViewComponent', () => {
  let component: SelectionViewComponent;
  let fixture: ComponentFixture<SelectionViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectionViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
