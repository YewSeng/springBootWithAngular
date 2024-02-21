import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUpdateUserComponent } from './admin-update-user.component';

describe('AdminUpdateUserComponent', () => {
  let component: AdminUpdateUserComponent;
  let fixture: ComponentFixture<AdminUpdateUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminUpdateUserComponent]
    });
    fixture = TestBed.createComponent(AdminUpdateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
