import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserViewBookingsComponent } from './user-view-bookings.component';

describe('UserViewBookingsComponent', () => {
  let component: UserViewBookingsComponent;
  let fixture: ComponentFixture<UserViewBookingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserViewBookingsComponent]
    });
    fixture = TestBed.createComponent(UserViewBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
