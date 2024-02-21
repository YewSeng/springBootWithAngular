import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverDashboardComponent } from './driver-dashboard.component';

describe('DriverDashboardComponent', () => {
  let component: DriverDashboardComponent;
  let fixture: ComponentFixture<DriverDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DriverDashboardComponent]
    });
    fixture = TestBed.createComponent(DriverDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
