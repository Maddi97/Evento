import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventPictureComponent } from './event-picture.component';

describe('EventPictureComponent', () => {
  let component: EventPictureComponent;
  let fixture: ComponentFixture<EventPictureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventPictureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventPictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
