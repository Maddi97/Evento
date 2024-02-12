import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTileListComponent } from './event-tile-list.component';

describe('EventTileListComponent', () => {
  let component: EventTileListComponent;
  let fixture: ComponentFixture<EventTileListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventTileListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventTileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
