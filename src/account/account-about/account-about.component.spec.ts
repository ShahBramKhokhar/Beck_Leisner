import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountAboutComponent } from './account-about.component';

describe('AccountAboutComponent', () => {
  let component: AccountAboutComponent;
  let fixture: ComponentFixture<AccountAboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountAboutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
