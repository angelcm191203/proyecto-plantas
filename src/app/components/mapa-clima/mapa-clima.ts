import { Component, Output, EventEmitter, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-mapa-clima',
  standalone: true,
  template: `<div id="map"></div>`,
  styleUrls: ['./mapa-clima.css']
})
export class MapaClimaComponent implements AfterViewInit {
  @Output() coordenadasSeleccionadas = new EventEmitter<{lat: number, lng: number}>();
  private map: L.Map | undefined;

  ngAfterViewInit(): void {
    // Usamos setTimeout para asegurar que el div exista en el DOM
    setTimeout(() => {
      this.initMap();
    }, 0);
  }

  private initMap(): void {
    this.map = L.map('map').setView([19.65, -98.98], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.coordenadasSeleccionadas.emit({ lat: e.latlng.lat, lng: e.latlng.lng });
    });
  }
}