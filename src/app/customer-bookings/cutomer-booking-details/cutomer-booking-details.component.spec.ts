import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CutomerBookingDetailsComponent } from './cutomer-booking-details.component';

describe('CutomerBookingDetailsComponent', () => {
  let component: CutomerBookingDetailsComponent;
  let fixture: ComponentFixture<CutomerBookingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CutomerBookingDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CutomerBookingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
