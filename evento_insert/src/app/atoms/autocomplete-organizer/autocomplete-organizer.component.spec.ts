import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutocompleteOrganizerComponent } from './autocomplete-organizer.component';

describe('AutocompleteOrganizerComponent', () => {
  let component: AutocompleteOrganizerComponent;
  let fixture: ComponentFixture<AutocompleteOrganizerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AutocompleteOrganizerComponent]
    });
    fixture = TestBed.createComponent(AutocompleteOrganizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
