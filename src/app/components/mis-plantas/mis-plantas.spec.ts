import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisPlantas } from './mis-plantas';

describe('MisPlantas', () => {
  let component: MisPlantas;
  let fixture: ComponentFixture<MisPlantas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisPlantas],
    }).compileComponents();

    fixture = TestBed.createComponent(MisPlantas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
