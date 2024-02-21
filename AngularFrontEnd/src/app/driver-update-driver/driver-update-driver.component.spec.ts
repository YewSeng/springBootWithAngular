import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverUpdateDriverComponent } from './driver-update-driver.component';

describe('DriverUpdateDriverComponent', () => {
  let component: DriverUpdateDriverComponent;
  let fixture: ComponentFixture<DriverUpdateDriverComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DriverUpdateDriverComponent]
    });
    fixture = TestBed.createComponent(DriverUpdateDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
