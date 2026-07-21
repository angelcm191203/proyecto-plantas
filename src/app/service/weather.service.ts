import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = '9312479d7e304de1834210550261307';
  private baseUrl = 'https://api.weatherapi.com/v1/current.json';
  private forecastUrl = 'https://api.weatherapi.com/v1/forecast.json'; // <--- Nuevo endpoint para pronóstico

  constructor(private http: HttpClient) { }

  getClima(ciudad: string): Observable<any> {
    const url = `${this.baseUrl}?key=${this.apiKey}&q=${ciudad}&aqi=no`;
    return this.http.get(url);
  }

  // <--- Nuevo método para obtener los días futuros (ej. 5 días)
getPronostico(ciudad: string, dias: number = 5): Observable<any> {
    const url = `${this.forecastUrl}?key=${this.apiKey}&q=${ciudad}&days=${dias}&aqi=no&alerts=no&lang=es`; // <--- Agregado &lang=es
    return this.http.get(url);
  }
}