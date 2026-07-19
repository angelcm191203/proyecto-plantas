import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaClima } from './mapa-clima';

describe('MapaClima', () => {
  let component: MapaClima;
  let fixture: ComponentFixture<MapaClima>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapaClima],
    }).compileComponents();

    fixture = TestBed.createComponent(MapaClima);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
