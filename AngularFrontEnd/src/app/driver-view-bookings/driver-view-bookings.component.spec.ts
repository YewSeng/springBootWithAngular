import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverViewBookingsComponent } from './driver-view-bookings.component';

describe('DriverViewBookingsComponent', () => {
  let component: DriverViewBookingsComponent;
  let fixture: ComponentFixture<DriverViewBookingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DriverViewBookingsComponent]
    });
    fixture = TestBed.createComponent(DriverViewBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
