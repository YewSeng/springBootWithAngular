import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperadminCreateAdminComponent } from './superadmin-create-admin.component';

describe('SuperadminCreateAdminComponent', () => {
  let component: SuperadminCreateAdminComponent;
  let fixture: ComponentFixture<SuperadminCreateAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuperadminCreateAdminComponent]
    });
    fixture = TestBed.createComponent(SuperadminCreateAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
