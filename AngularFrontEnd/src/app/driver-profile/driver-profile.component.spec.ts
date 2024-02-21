import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverProfileComponent } from './driver-profile.component';

describe('DriverProfileComponent', () => {
  let component: DriverProfileComponent;
  let fixture: ComponentFixture<DriverProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DriverProfileComponent]
    });
    fixture = TestBed.createComponent(DriverProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
