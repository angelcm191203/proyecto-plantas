import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface DatosClimaMaster {
  temperatura: number;
  sensacion: number;
  maxMin: string;
  estado: string;
  condicion: 'sunny' | 'cloudy' | 'rainy' | 'thunder' | 'windy' | 'snow';
  horario: 'amanecer' | 'dia' | 'atardecer' | 'noche';
  gatitoUrl: string;
  viento: number;
  lluviaProb: number;
  uv: string;
  solPct: number;
  consejoRiego: string;
  consejoSol: string;
  consejoSustrato: string;
}

@Component({
  selector: 'app-clima',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clima.html',
  styleUrls: ['./clima.css']
})
export class ClimaComponent implements OnInit {

  ubicacionActual = signal<string>('Paseos de San Juan');
  cargando = signal<boolean>(false);
  
  datosClima = signal<DatosClimaMaster>({
    temperatura: 19,
    sensacion: 19,
    maxMin: '↑ 24° / ↓ 12°',
    estado: 'Mayormente Nublado',
    condicion: 'cloudy',
    horario: 'dia',
    gatitoUrl: 'https://images.vexels.com/media/users/3/242316/isolated/preview/4dfa34ee969c362b6620f4c084fa6b21-gato-negro-sentado-de-espaldas.png',
    viento: 14,
    lluviaProb: 44,
    uv: 'Bajo (2)',
    solPct: 15,
    consejoRiego: 'La demanda hídrica es baja. El sustrato mantendrá la humedad estable.',
    consejoSol: 'Luz difusa y protectora natural para las hojas más tiernas.',
    consejoSustrato: 'Vigila que la tierra respire correctamente para evitar estancamientos.'
  });

  ngOnInit(): void {
    this.cargarDatosClima();
  }

  // Simulación de los cambios que enviará tu API real
  cargarDatosClima(): void {
    this.cargando.set(true);
    setTimeout(() => {
      const piscinaClimas: DatosClimaMaster[] = [
        {
          temperatura: 19,
          sensacion: 19,
          maxMin: '↑ 24° / ↓ 12°',
          estado: 'Mayormente Nublado',
          condicion: 'cloudy',
          horario: 'dia',
          gatitoUrl: 'https://images.vexels.com/media/users/3/242316/isolated/preview/4dfa34ee969c362b6620f4c084fa6b21-gato-negro-sentado-de-espaldas.png',
          viento: 14,
          lluviaProb: 44,
          uv: 'Moderado (3)',
          solPct: 35,
          consejoRiego: 'Evaporación moderada. Riega solo si el sustrato está seco a dos centímetros de profundidad.',
          consejoSol: 'La nubosidad actúa como filtro natural. Ideal para plantas sensibles.',
          consejoSustrato: 'Humedad ambiental estable. Buena oxigenación del suelo.'
        },
        {
          temperatura: 18,
          sensacion: 17,
          maxMin: '↑ 24° / ↓ 13°',
          estado: 'Tormenta Eléctrica',
          condicion: 'thunder',
          horario: 'atardecer',
          gatitoUrl: 'https://images.vexels.com/media/users/3/235862/isolated/preview/e913a82df362f6d2da59f77e6fa56291-silueta-de-gato-asustado.png',
          viento: 28,
          lluviaProb: 95,
          uv: 'Bajo (0)',
          solPct: 0,
          consejoRiego: 'Precipitaciones fuertes. Suspende cualquier tipo de riego manual inmediatamente.',
          consejoSol: 'Cielo totalmente oscuro. La fotosíntesis se encuentra temporalmente en pausa.',
          consejoSustrato: 'Riesgo alto de saturación. Asegúrate de drenar platos y contenedores exteriores.'
        },
        {
          temperatura: 12,
          sensacion: 10,
          maxMin: '↑ 15° / ↓ 6°',
          estado: 'Vientos Fuertes',
          condicion: 'windy',
          horario: 'noche',
          gatitoUrl: 'https://images.vexels.com/media/users/3/242200/isolated/preview/fa91d09726df21a11584347209e5309d-gato-negro-caminando-de-lado.png',
          viento: 45,
          lluviaProb: 10,
          uv: 'Nulo (0)',
          solPct: 0,
          consejoRiego: 'El viento reseca las hojas superficiales con rapidez. Revisa la humedad mañana temprano.',
          consejoSol: 'Periodo de descanso nocturno bajo ráfagas continentales.',
          consejoSustrato: 'Peligro de caída en macetas ligeras. Asegura o resguarda los ejemplares altos.'
        }
      ];

      const ram = piscinaClimas[Math.floor(Math.random() * piscinaClimas.length)];
      this.datosClima.set(ram);
      this.cargando.set(false);
    }, 700);
  }

  // Genera la clase combinada ej: 'sky-cloudy-dia', 'sky-thunder-atardecer'
  obtenerEstiloAtmosferico(): string {
    const c = this.datosClima();
    return `sky-${c.condicion}-${c.horario}`;
  }
}