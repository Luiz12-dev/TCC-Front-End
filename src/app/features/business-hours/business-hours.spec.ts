import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessHours } from './business-hours';

describe('BusinessHours', () => {
  let component: BusinessHours;
  let fixture: ComponentFixture<BusinessHours>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessHours],
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessHours);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
