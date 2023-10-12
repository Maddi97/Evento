import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullEventComponent } from './full-event.component';

describe('FullEventComponent', () => {
  let component: FullEventComponent;
  let fixture: ComponentFixture<FullEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
