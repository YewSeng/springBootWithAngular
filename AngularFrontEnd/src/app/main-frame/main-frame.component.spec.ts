import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainFrameComponent } from './main-frame.component';

describe('MainFrameComponent', () => {
  let component: MainFrameComponent;
  let fixture: ComponentFixture<MainFrameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MainFrameComponent]
    });
    fixture = TestBed.createComponent(MainFrameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
