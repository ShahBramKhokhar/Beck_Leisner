import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountTeamComponent } from './account-team.component';

describe('AccountTeamComponent', () => {
  let component: AccountTeamComponent;
  let fixture: ComponentFixture<AccountTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountTeamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
