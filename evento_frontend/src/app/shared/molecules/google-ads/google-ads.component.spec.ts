import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleAdsComponent } from './google-ads.component';

describe('GoogleAdsComponent', () => {
  let component: GoogleAdsComponent;
  let fixture: ComponentFixture<GoogleAdsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GoogleAdsComponent]
    });
    fixture = TestBed.createComponent(GoogleAdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
