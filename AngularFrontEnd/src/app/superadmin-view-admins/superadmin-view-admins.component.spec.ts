import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperadminViewAdminsComponent } from './superadmin-view-admins.component';

describe('SuperadminViewAdminsComponent', () => {
  let component: SuperadminViewAdminsComponent;
  let fixture: ComponentFixture<SuperadminViewAdminsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuperadminViewAdminsComponent]
    });
    fixture = TestBed.createComponent(SuperadminViewAdminsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
