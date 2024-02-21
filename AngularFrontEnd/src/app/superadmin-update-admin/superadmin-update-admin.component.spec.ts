import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperadminUpdateAdminComponent } from './superadmin-update-admin.component';

describe('SuperadminUpdateAdminComponent', () => {
  let component: SuperadminUpdateAdminComponent;
  let fixture: ComponentFixture<SuperadminUpdateAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuperadminUpdateAdminComponent]
    });
    fixture = TestBed.createComponent(SuperadminUpdateAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
