import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalSettingsFormComponent } from './global-settings-form.component';

describe('GlobalSettingsFormComponent', () => {
  let component: GlobalSettingsFormComponent;
  let fixture: ComponentFixture<GlobalSettingsFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GlobalSettingsFormComponent]
    });
    fixture = TestBed.createComponent(GlobalSettingsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
