import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserUpdateBookingComponent } from './user-update-booking.component';

describe('UserUpdateBookingComponent', () => {
  let component: UserUpdateBookingComponent;
  let fixture: ComponentFixture<UserUpdateBookingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserUpdateBookingComponent]
    });
    fixture = TestBed.createComponent(UserUpdateBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
