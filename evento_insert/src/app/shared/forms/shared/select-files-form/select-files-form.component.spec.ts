import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectFilesFormComponent } from './select-files-form.component';

describe('SelectFilesFormComponent', () => {
  let component: SelectFilesFormComponent;
  let fixture: ComponentFixture<SelectFilesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectFilesFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectFilesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
