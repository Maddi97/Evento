import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppStoreBannerComponent } from './app-store-banner.component';

describe('AppStoreBannerComponent', () => {
  let component: AppStoreBannerComponent;
  let fixture: ComponentFixture<AppStoreBannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppStoreBannerComponent]
    });
    fixture = TestBed.createComponent(AppStoreBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
