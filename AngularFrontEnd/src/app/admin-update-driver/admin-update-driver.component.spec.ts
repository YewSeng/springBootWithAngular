import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUpdateDriverComponent } from './admin-update-driver.component';

describe('AdminUpdateDriverComponent', () => {
  let component: AdminUpdateDriverComponent;
  let fixture: ComponentFixture<AdminUpdateDriverComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminUpdateDriverComponent]
    });
    fixture = TestBed.createComponent(AdminUpdateDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
