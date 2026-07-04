import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Credenciales } from './credenciales';

describe('Credenciales', () => {
  let component: Credenciales;
  let fixture: ComponentFixture<Credenciales>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Credenciales],
    }).compileComponents();

    fixture = TestBed.createComponent(Credenciales);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
