import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoPlantas } from './historico-plantas';

describe('HistoricoPlantas', () => {
  let component: HistoricoPlantas;
  let fixture: ComponentFixture<HistoricoPlantas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricoPlantas],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoricoPlantas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
