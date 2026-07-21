import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../../service/weather.service';
import { MapaClimaComponent } from '../mapa-clima/mapa-clima';

interface DatosClimaMaster {
  ubicacion: string;
  temperatura: number;
  sensacion: number;
  maxMin: string;
  estado: string;
  condicion: string;
  horario: string;
  gatitoUrl: string;
  viento: number;
  lluviaProb: number;
  uv: string;
  solPct: number;
  consejoRiego: string;
  consejoSol: string;
  consejoSustrato: string;
  pronosticoDias: any[];
}

@Component({
  selector: 'app-clima',
  standalone: true,
  imports: [CommonModule, MapaClimaComponent],
  templateUrl: './clima.html',
  styleUrls: ['./clima.css']
})
export class ClimaComponent implements OnInit {
  private weatherService = inject(WeatherService);

  ubicacionActual = signal<string>('Tepexpan');
  cargando = signal<boolean>(false);
  datosClima = signal<DatosClimaMaster>({} as DatosClimaMaster);

  ngOnInit(): void {
    // 💡 Verificamos si ya hay una ubicación guardada previamente antes de recurrir al valor por defecto
    const ultimaUbicacionGuardada = localStorage.getItem('ubicacionClima');

    if (ultimaUbicacionGuardada) {
      this.cargarDatosClima(ultimaUbicacionGuardada);
    } else {
      this.obtenerUbicacionYClima();
    }
  }

  actualizarClima(coordenadas: {lat: number, lng: number}): void {
    const query = `${coordenadas.lat},${coordenadas.lng}`;
    this.cargarDatosClima(query);
  }

  obtenerEstiloAtmosferico(): string {
    const datos = this.datosClima();
    return (datos && datos.condicion) ? `sky-${datos.condicion}-${datos.horario || 'dia'}` : 'sky-cloudy-dia';
  }

  obtenerUbicacionYClima(): void {
    this.cargando.set(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = `${position.coords.latitude},${position.coords.longitude}`;
          this.cargarDatosClima(coords);
        },
        () => this.cargarDatosClima('Tepexpan')
      );
    } else {
      this.cargarDatosClima('Tepexpan');
    }
  }

  cargarDatosClima(query: string): void {
    this.cargando.set(true);

    // Guardamos la coordenada o ubicación actual en el localStorage para sincronizarla con "Mis Plantas"
    localStorage.setItem('ubicacionClima', query);

    this.weatherService.getPronostico(query, 5).subscribe({
      next: (data: any) => {
        const condicionTexto = data.current.condition.text.toLowerCase();
        
        let claseClima = 'cloudy';
        if (condicionTexto.includes('sun') || condicionTexto.includes('clear')) claseClima = 'sunny';
        else if (condicionTexto.includes('rain')) claseClima = 'rainy';
        else if (condicionTexto.includes('thunder')) claseClima = 'thunder';

        const hoyForecast = data.forecast?.forecastday[0]?.day;

        this.ubicacionActual.set(data.location.name);
        this.datosClima.set({
          ubicacion: data.location.name,
          temperatura: data.current.temp_c,
          sensacion: data.current.feelslike_c,
          maxMin: hoyForecast ? `↑ ${hoyForecast.maxtemp_c}° / ↓ ${hoyForecast.mintemp_c}°` : 'N/D',
          estado: data.current.condition.text,
          condicion: claseClima,
          horario: 'dia',
          gatitoUrl: 'https://images.vexels.com/media/users/3/242316/isolated/preview/4dfa34ee969c362b6620f4c084fa6b21-gato-negro-sentado-de-espaldas.png',
          viento: data.current.wind_kph,
          lluviaProb: data.current.humidity,
          uv: data.current.uv.toString(),
          solPct: 0,
          consejoRiego: 'Riega al atardecer.',
          consejoSol: 'Protege del sol directo.',
          consejoSustrato: 'Revisa el drenaje.',
          pronosticoDias: data.forecast?.forecastday || []
        });
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }
}