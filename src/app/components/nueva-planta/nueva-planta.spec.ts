import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaPlanta } from './nueva-planta';

describe('NuevaPlanta', () => {
  let component: NuevaPlanta;
  let fixture: ComponentFixture<NuevaPlanta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevaPlanta],
    }).compileComponents();

    fixture = TestBed.createComponent(NuevaPlanta);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
