import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  // Asegúrate de que no haya espacios antes o después de la llave
  private apiKey = '9312479d7e304de1834210550261307';
  private baseUrl = 'https://api.weatherapi.com/v1/current.json';

  constructor(private http: HttpClient) { }

  getClima(ciudad: string): Observable<any> {
    // Es muy importante que la URL sea exactamente esta
    const url = `${this.baseUrl}?key=${this.apiKey}&q=${ciudad}&aqi=no`;
    return this.http.get(url);
  }
}