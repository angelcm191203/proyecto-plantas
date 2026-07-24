import { Component, signal, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExifService } from './exif.service';
import { WeatherService } from '../../service/weather.service';

interface Planta {
  id: number | string;
  nombre: string;
  especie: string;
  etapaDesarrollo: string;
  ubicacion: string;
  imagenUrl: string;
  estado: 'good' | 'warn' | 'alert';
  estadoTexto: string;
  riegoFrecuencia: string;
  solTipo: string;
  tempRango: string;
  progresoRiego: number;
  progresoSol: number;
  progresoSalud: number;
  puntuacionGeneral?: number;
  fechaRegistro?: string;
  ultimoRiego?: string;
  fechaCaptura?: Date;
  latitud?: number;
  longitud?: number;
}

interface Clima {
  temperatura: number;
  descripcion: string;
  sensacionTermica: number;
  hora: string;
  icono: string;
  color: string;
}

@Component({
  selector: 'app-mis-plantas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mis-plantas.html',
  styleUrls: ['./mis-plantas.css']
})
export class MisPlantasComponent implements OnInit {

  private exifService = inject(ExifService);
  private weatherService = inject(WeatherService);

  temperaturaActual: number = 0;
  alertaCalor: boolean = false;
  alertaFrio: boolean = false;
  climaIdeal: boolean = false;

  private plantasPorDefecto: Planta[] = [
    {
      id: '1',
      nombre: 'Cebolla del Patio',
      especie: 'Cebolla',
      etapaDesarrollo: 'Crecimiento / Desarrollo vegetativo',
      ubicacion: 'Huerto',
      imagenUrl: '', 
      estado: 'good',
      estadoTexto: 'Saludable',
      riegoFrecuencia: 'Cada 3d',
      solTipo: 'Pleno',
      tempRango: '18-24°C',
      progresoRiego: 85,
      progresoSol: 70,
      progresoSalud: 82,
      puntuacionGeneral: 5,
      fechaRegistro: new Date().toLocaleDateString('es-MX'),
      ultimoRiego: 'Hoy'
    }
  ];

  plantas = signal<Planta[]>([]);
  mensaje = signal<{ texto: string; tipo: 'ok' | 'error' } | null>(null);
  cargandoClima = signal<boolean>(false);
  climaActual = signal<Clima | null>({
    temperatura: 15,
    descripcion: 'Fresco / nublado',
    sensacionTermica: 15,
    hora: '00:00',
    icono: 'fa-cloud',
    color: '#52b788'
  });

  modalAbierto = signal<boolean>(false);
  modalImagenUrl = signal<string>('');
  modalMetadatos = signal<{ fecha?: Date; latitud?: number; longitud?: number } | null>(null);

  fechaActualCalendario = signal<Date>(new Date());
  nombresDia = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

  nombreMes = computed(() => {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return `${meses[this.fechaActualCalendario().getMonth()]} ${this.fechaActualCalendario().getFullYear()}`;
  });

  catalogoCultivos = [
    { nombre: 'Cebolla', riego: 'Cada 3d', sol: 'Pleno', temp: '18-24°C' },
    { nombre: 'Papa', riego: 'Cada 2d', sol: 'Parcial', temp: '15-20°C' },
    { nombre: 'Tomate / Jitomate', riego: 'Cada 2d', sol: 'Pleno', temp: '20-26°C' },
    { nombre: 'Lechuga', riego: 'Cada 1-2d', sol: 'Parcial', temp: '14-18°C' },
    { nombre: 'Chile / Pimiento', riego: 'Cada 3d', sol: 'Pleno', temp: '21-28°C' }
  ];

  ngOnInit(): void {
    this.cargarPlantasAlmacenadas();
    this.verificarClimaParaPlantas();
  }

  private cargarPlantasAlmacenadas(): void {
    const guardadas = localStorage.getItem('plantas_bitacora');
    if (guardadas) {
      this.plantas.set(JSON.parse(guardadas));
    } else {
      this.plantas.set(this.plantasPorDefecto);
      this.guardarEnLocalStorage(this.plantasPorDefecto);
    }
  }

  private guardarEnLocalStorage(lista: Planta[]): void {
    localStorage.setItem('plantas_bitacora', JSON.stringify(lista));
  }

  mesAnterior(): void {
    const fechaActual = this.fechaActualCalendario();
    this.fechaActualCalendario.set(new Date(fechaActual.getFullYear(), fechaActual.getMonth() - 1, 1));
  }

  mesSiguiente(): void {
    const fechaActual = this.fechaActualCalendario();
    this.fechaActualCalendario.set(new Date(fechaActual.getFullYear(), fechaActual.getMonth() + 1, 1));
  }

  diasDelMes(planta: Planta) {
    const anio = this.fechaActualCalendario().getFullYear();
    const mes = this.fechaActualCalendario().getMonth();
    
    const primerDiaIndex = new Date(anio, mes, 1).getDay();
    const ultimoDia = new Date(anio, mes + 1, 0).getDate();
    
    const diasArray = [];
    const hoyStr = new Date().toDateString();

    for (let i = 0; i < primerDiaIndex; i++) {
      diasArray.push({ fueraDeMes: true, claveFecha: `vacio-${i}` });
    }

    for (let dia = 1; dia <= ultimoDia; dia++) {
      const fechaIterada = new Date(anio, mes, dia);
      diasArray.push({
        numero: dia,
        fueraDeMes: false,
        esHoy: fechaIterada.toDateString() === hoyStr,
        esFuturo: fechaIterada > new Date(),
        claveFecha: `${anio}-${mes}-${dia}`,
        cuidadoHecho: dia === 5,
        clima: null
      });
    }

    return diasArray;
  }

  textoUltimoCuidado(planta: Planta): string {
    return planta.ultimoRiego || 'Sin registros aún';
  }

  verificarClimaParaPlantas(): void {
    const ubicacionSeleccionada = localStorage.getItem('ubicacionClima') || 'Tepexpan';

    this.weatherService.getClima(ubicacionSeleccionada).subscribe({
      next: (data: any) => {
        this.temperaturaActual = data.current.temp_c;
        
        this.alertaCalor = this.temperaturaActual > 30;
        this.alertaFrio = this.temperaturaActual < 12;
        this.climaIdeal = this.temperaturaActual >= 15 && this.temperaturaActual <= 26;

        this.climaActual.set({
          temperatura: data.current.temp_c,
          descripcion: data.current.condition.text,
          sensacionTermica: data.current.feelslike_c,
          hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          icono: 'fa-sun',
          color: '#FDA769'
        });
      },
      error: (err) => console.error('Error al sincronizar clima:', err)
    });
  }

  abrirModal(): void {
    this.modalImagenUrl.set('');
    this.modalMetadatos.set(null);
    this.modalAbierto.set(true);
  }

  cerrarModal(): void {
    this.modalAbierto.set(false);
  }

  guardarPlanta(nombrePersonalizado: string, etapaDesarrollo: string, ubicacion: string, riegoFrecuencia: string): void {
    if (!nombrePersonalizado.trim()) {
      this.mensaje.set({ texto: 'Por favor, asígnale un nombre a tu planta.', tipo: 'error' });
      return;
    }

    const metadatosFoto = this.modalMetadatos();

    const nuevaPlanta: Planta = {
      id: Date.now().toString(),
      nombre: nombrePersonalizado.trim(),
      especie: 'Cultivo Personalizado',
      etapaDesarrollo: etapaDesarrollo || 'Crecimiento / Desarrollo vegetativo',
      ubicacion: ubicacion,
      imagenUrl: this.modalImagenUrl(),
      estado: 'good',
      estadoTexto: 'Saludable',
      riegoFrecuencia: riegoFrecuencia || 'Cada 3d',
      solTipo: 'Pleno',
      tempRango: '18-25°C',
      progresoRiego: 100,
      progresoSol: 100,
      progresoSalud: 100,
      puntuacionGeneral: 5,
      fechaRegistro: new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }),
      ultimoRiego: 'Hoy',
      fechaCaptura: metadatosFoto?.fecha,
      latitud: metadatosFoto?.latitud,
      longitud: metadatosFoto?.longitud
    };

    this.plantas.update(lista => {
      const listaActualizada = [...lista, nuevaPlanta];
      this.guardarEnLocalStorage(listaActualizada);
      return listaActualizada;
    });

    this.cerrarModal();
    this.mensaje.set({ texto: `¡${nombrePersonalizado} registrada con éxito!`, tipo: 'ok' });
  }

  registrarRiego(id: number | string): void {
    this.plantas.update(lista => {
      const listaActualizada = lista.map(p => {
        if (p.id === id) {
          return { ...p, progresoRiego: 100, estado: 'good' as const, estadoTexto: 'Saludable', ultimoRiego: 'Hoy' };
        }
        return p;
      });
      this.guardarEnLocalStorage(listaActualizada);
      return listaActualizada;
    });
    this.mensaje.set({ texto: '¡Riego registrado! Progreso actualizado.', tipo: 'ok' });
  }

  eliminarPlanta(id: number | string): void {
    this.plantas.update(lista => {
      const listaActualizada = lista.filter(p => p.id !== id);
      this.guardarEnLocalStorage(listaActualizada);
      return listaActualizada;
    });
    this.mensaje.set({ texto: 'Planta eliminada de tu colección.', tipo: 'ok' });
  }

  async onModalFotoSeleccionada(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      const reader = new FileReader();
      reader.onload = () => this.modalImagenUrl.set(reader.result as string);
      reader.readAsDataURL(file);

      try {
        const metadatos = await this.exifService.leerMetadatos(file);
        this.modalMetadatos.set(metadatos);
      } catch (error) {
        this.modalMetadatos.set(null);
      }
    }
  }

  eliminarFotoModal(): void {
    this.modalImagenUrl.set('');
    this.modalMetadatos.set(null);
  }

  async onFotoSeleccionada(event: Event, planta: Planta): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input || !input.files || input.files.length === 0) return;

    const file = input.files[0];
    let exifDetectado: any = null;
    try {
      exifDetectado = await this.exifService.leerMetadatos(file);
    } catch (error) {
      console.error('No EXIF:', error);
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.plantas.update(lista => {
        const listaActualizada = lista.map(p => {
          if (p.id === planta.id) {
            return { 
              ...p, 
              imagenUrl: reader.result as string,
              fechaCaptura: exifDetectado?.fecha || undefined,
              latitud: exifDetectado?.latitud || undefined,
              longitud: exifDetectado?.longitud || undefined
            };
          }
          return p;
        });
        this.guardarEnLocalStorage(listaActualizada);
        return listaActualizada;
      });
      this.mensaje.set({ texto: `Foto de ${planta.nombre} actualizada.`, tipo: 'ok' });
    };
    
    reader.readAsDataURL(file);
  }

  actualizarClimaActual(): void {
    this.cargandoClima.set(true);
    setTimeout(() => {
      this.cargandoClima.set(false);
      this.verificarClimaParaPlantas();
    }, 1000);
  }

  cerrarMensaje(): void { 
    this.mensaje.set(null); 
  }
}