import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertEventComponent } from './insert-event.component';

describe('InsertEventComponent', () => {
  let component: InsertEventComponent;
  let fixture: ComponentFixture<InsertEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsertEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
