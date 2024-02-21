import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminCreateBookingComponent } from './admin-create-booking.component';

describe('AdminCreateBookingComponent', () => {
  let component: AdminCreateBookingComponent;
  let fixture: ComponentFixture<AdminCreateBookingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminCreateBookingComponent]
    });
    fixture = TestBed.createComponent(AdminCreateBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
