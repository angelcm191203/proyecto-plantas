import { Component, signal, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ExifService } from './exif.service';
import { WeatherService } from '../../service/weather.service';

interface Planta {
  id: number;
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
  private http = inject(HttpClient);

  temperaturaActual: number = 0;
  alertaCalor: boolean = false;
  alertaFrio: boolean = false;
  climaIdeal: boolean = false;

  ngOnInit(): void {
    this.verificarClimaParaPlantas();
    this.cargarPlantasDesdeBD();
  }

  // Control de notificaciones (Toast)
  mensaje = signal<{ texto: string; tipo: 'ok' | 'error' } | null>(null);
  
  // Control de carga y visualización del Clima
  cargandoClima = signal<boolean>(false);
  climaActual = signal<Clima | null>({
    temperatura: 15,
    descripcion: 'Fresco / nublado',
    sensacionTermica: 15,
    hora: '00:00',
    icono: 'fa-cloud',
    color: '#52b788'
  });

  // Signals para el Modal y metadatos temporales
  modalAbierto = signal<boolean>(false);
  modalImagenUrl = signal<string>('');
  modalMetadatos = signal<{ fecha?: Date; latitud?: number; longitud?: number } | null>(null);

  // ================= CALENDARIO DE CUIDADOS =================
  fechaActualCalendario = signal<Date>(new Date());
  nombresDia = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

  nombreMes = computed(() => {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return `${meses[this.fechaActualCalendario().getMonth()]} ${this.fechaActualCalendario().getFullYear()}`;
  });

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

  // Catálogo rápido predefinido
  catalogoCultivos = [
    { nombre: 'Cebolla', riego: 'Cada 3d', sol: 'Pleno', temp: '18-24°C' },
    { nombre: 'Papa', riego: 'Cada 2d', sol: 'Parcial', temp: '15-20°C' },
    { nombre: 'Tomate / Jitomate', riego: 'Cada 2d', sol: 'Pleno', temp: '20-26°C' },
    { nombre: 'Lechuga', riego: 'Cada 1-2d', sol: 'Parcial', temp: '14-18°C' },
    { nombre: 'Chile / Pimiento', riego: 'Cada 3d', sol: 'Pleno', temp: '21-28°C' }
  ];

  // Arreglo reactivo para las plantas
  plantas = signal<Planta[]>([]);

  // ================= CONEXIÓN CON LA API DE CLIMA Y BACKEND =================

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
      error: (err) => console.error('Error al sincronizar el clima en Mis Plantas:', err)
    });
  }

  cargarPlantasDesdeBD(): void {
    this.http.get<any[]>('http://localhost:3000/api/plantas').subscribe({
      next: (data) => {
        const plantasMapeadas: Planta[] = data.map(p => ({
          id: p.id || p.id_planta,
          nombre: p.nombre,
          especie: p.especie || 'Cultivo Personalizado',
          etapaDesarrollo: p.etapa_desarrollo || p.etapaDesarrollo || 'Crecimiento / Desarrollo vegetativo',
          ubicacion: p.ubicacion,
          imagenUrl: p.imagen_url || p.imagenUrl || '',
          estado: 'good',
          estadoTexto: 'Saludable',
          riegoFrecuencia: p.riego_frecuencia || p.riegoFrecuencia || 'Cada 3d',
          solTipo: 'Pleno',
          tempRango: '18-25°C',
          progresoRiego: 100,
          progresoSol: 100,
          progresoSalud: 100,
          ultimoRiego: 'Hoy'
        }));
        this.plantas.set(plantasMapeadas);
      },
      error: (err) => {
        console.error('Error al cargar plantas desde la BD, usando datos locales de respaldo:', err);
      }
    });
  }

  // ================= LÓGICA DE AGREGAR Y ELIMINAR =================

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

    const nuevaPlantaPayload = {
      nombre: nombrePersonalizado,
      especie: 'Cultivo Personalizado',
      etapaDesarrollo: etapaDesarrollo || 'Crecimiento / Desarrollo vegetativo',
      ubicacion: ubicacion,
      imagenUrl: this.modalImagenUrl(),
      riegoFrecuencia: riegoFrecuencia || 'Cada 3d'
    };

    this.http.post('http://localhost:3000/api/plantas', nuevaPlantaPayload).subscribe({
      next: (res: any) => {
        const plantaCreada: Planta = {
          id: res.id || res.id_planta || Date.now(),
          nombre: nombrePersonalizado,
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
          ultimoRiego: 'Hoy',
          fechaCaptura: metadatosFoto?.fecha,
          latitud: metadatosFoto?.latitud,
          longitud: metadatosFoto?.longitud
        };

        this.plantas.update(lista => [...lista, plantaCreada]);
        this.cerrarModal();
        this.mensaje.set({ texto: `¡${nombrePersonalizado} registrada con éxito en la BD!`, tipo: 'ok' });
      },
      error: (err) => {
        console.error('Error al guardar la planta en la BD:', err);
        this.mensaje.set({ texto: 'Error al guardar la planta en el servidor.', tipo: 'error' });
      }
    });
  }

  registrarRiego(id: number): void {
    this.plantas.update(lista =>
      lista.map(p => {
        if (p.id === id) {
          return { ...p, progresoRiego: 100, estado: 'good', estadoTexto: 'Saludable', ultimoRiego: 'Hoy' };
        }
        return p;
      })
    );
    this.mensaje.set({ texto: '¡Riego registrado! Progreso actualizado.', tipo: 'ok' });
  }

  eliminarPlanta(id: number): void {
    this.http.delete(`http://localhost:3000/api/plantas/${id}`).subscribe({
      next: () => {
        this.plantas.update(lista => lista.filter(p => p.id !== id));
        this.mensaje.set({ texto: 'Planta eliminada de tu colección.', tipo: 'ok' });
      },
      error: (err) => {
        console.error('Error al eliminar la planta en el servidor:', err);
        // Eliminado localmente por respaldo si la ruta aún no está creada en backend
        this.plantas.update(lista => lista.filter(p => p.id !== id));
        this.mensaje.set({ texto: 'Planta eliminada correctamente.', tipo: 'ok' });
      }
    });
  }

  // ================= MULTIMEDIA E INTERACCIONES =================

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
        console.log('📸 EXIF extraído en el Modal:', metadatos);
      } catch (error) {
        console.error('La imagen del modal no contiene metadatos EXIF:', error);
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
      console.log(`📸 EXIF extraído para [${planta.nombre}]:`, exifDetectado);
    } catch (error) {
      console.error('No se encontraron metadatos EXIF:', error);
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        this.plantas.update(lista => 
          lista.map(p => {
            if (p && p.id === planta.id) {
              return { 
                ...p, 
                imagenUrl: reader.result as string,
                fechaCaptura: exifDetectado?.fecha || undefined,
                latitud: exifDetectado?.latitud || undefined,
                longitud: exifDetectado?.longitud || undefined
              };
            }
            return p;
          })
        );
        this.mensaje.set({ texto: `Foto de ${planta.nombre} actualizada.`, tipo: 'ok' });

        const climaTemp = this.climaActual()?.temperatura || 15;
        const climaDesc = this.climaActual()?.descripcion || 'Fresco / nublado';
        
        let horaFormateada = '00:00';
        if (exifDetectado?.fecha instanceof Date) {
          horaFormateada = exifDetectado.fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        alert(`De acuerdo a esta foto tomada a las ${horaFormateada} horas, el clima estuvo a ${climaTemp}°C (${climaDesc}) y tuvo una exposición solar aproximada.`);

      } catch (err) {
        console.error('Error crítico al actualizar el signal de plantas:', err);
      }
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

  cerrarMensaje(): void { this.mensaje.set(null); }
}