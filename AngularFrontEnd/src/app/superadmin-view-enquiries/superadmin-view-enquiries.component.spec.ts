import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperadminViewEnquiriesComponent } from './superadmin-view-enquiries.component';

describe('SuperadminViewEnquiriesComponent', () => {
  let component: SuperadminViewEnquiriesComponent;
  let fixture: ComponentFixture<SuperadminViewEnquiriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuperadminViewEnquiriesComponent]
    });
    fixture = TestBed.createComponent(SuperadminViewEnquiriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
