import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserUpdateUserComponent } from './user-update-user.component';

describe('UserUpdateUserComponent', () => {
  let component: UserUpdateUserComponent;
  let fixture: ComponentFixture<UserUpdateUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserUpdateUserComponent]
    });
    fixture = TestBed.createComponent(UserUpdateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
