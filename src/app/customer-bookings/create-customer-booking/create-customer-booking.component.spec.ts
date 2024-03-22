import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCustomerBookingComponent } from './create-customer-booking.component';

describe('CreateCustomerBookingComponent', () => {
  let component: CreateCustomerBookingComponent;
  let fixture: ComponentFixture<CreateCustomerBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateCustomerBookingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCustomerBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
