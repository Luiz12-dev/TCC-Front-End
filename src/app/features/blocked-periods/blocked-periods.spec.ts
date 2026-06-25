import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockedPeriods } from './blocked-periods';

describe('BlockedPeriods', () => {
  let component: BlockedPeriods;
  let fixture: ComponentFixture<BlockedPeriods>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlockedPeriods],
    }).compileComponents();

    fixture = TestBed.createComponent(BlockedPeriods);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
