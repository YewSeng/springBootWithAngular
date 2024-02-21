import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUpdateBookingComponent } from './admin-update-booking.component';

describe('AdminUpdateBookingComponent', () => {
  let component: AdminUpdateBookingComponent;
  let fixture: ComponentFixture<AdminUpdateBookingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminUpdateBookingComponent]
    });
    fixture = TestBed.createComponent(AdminUpdateBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
