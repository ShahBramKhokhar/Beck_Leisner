/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { View_product_item_activity_dialogComponent } from './view_product_item_activity_dialog.component';

describe('View_product_item_activity_dialogComponent', () => {
  let component: View_product_item_activity_dialogComponent;
  let fixture: ComponentFixture<View_product_item_activity_dialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ View_product_item_activity_dialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(View_product_item_activity_dialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
