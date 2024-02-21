import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewDriversComponent } from './admin-view-drivers.component';

describe('AdminViewDriversComponent', () => {
  let component: AdminViewDriversComponent;
  let fixture: ComponentFixture<AdminViewDriversComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminViewDriversComponent]
    });
    fixture = TestBed.createComponent(AdminViewDriversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
