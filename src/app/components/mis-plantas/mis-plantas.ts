import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExifService } from './exif.service'; // 👈 Asegúrate de que la ruta sea correcta

// Definición de las interfaces para un tipado estricto
interface Planta {
  id: number;
  nombre: string;
  especie: string;
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
  // Agregamos campos opcionales para guardar los metadatos de las fotos
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
  imports: [CommonModule],
  templateUrl: './mis-plantas.html',
  styleUrls: ['./mis-plantas.css']
})
export class MisPlantasComponent {
  
  // Inyectamos el servicio EXIF en el constructor
  constructor(private exifService: ExifService) {}

  // 1. Estructura básica para el mini-calendario de las tarjetas
  nombresDia: string[] = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
  nombreMes = signal<string>('Julio 2026');
  
  // 2. Control de notificaciones (Toast)
  mensaje = signal<{ texto: string; tipo: 'ok' | 'error' } | null>(null);
  
  // 3. Control de carga y visualización del Clima
  cargandoClima = signal<boolean>(false);
  climaActual = signal<Clima | null>({
    temperatura: 15,
    descripcion: 'Fresco / nublado',
    sensacionTermica: 15,
    hora: '00:00',
    icono: 'fa-cloud',
    color: '#52b788'
  });

  // 4. Signals para el Modal y metadatos temporales del modal
  modalAbierto = signal<boolean>(false);
  modalImagenUrl = signal<string>('');
  modalMetadatos = signal<{ fecha?: Date; latitud?: number; longitud?: number } | null>(null);

  // 5. Arreglo reactivo inicial con tus cultivos dinámicos (Mock data)
  plantas = signal<Planta[]>([
    {
      id: 1,
      nombre: 'Cebolla',
      especie: 'Allium cepa',
      ubicacion: 'Huerto',
      imagenUrl: '', 
      estado: 'good',
      estadoTexto: 'Saludable',
      riegoFrecuencia: 'Cada 3d',
      solTipo: 'Pleno',
      tempRango: '18-24°C',
      progresoRiego: 85,
      progresoSol: 70,
      progresoSalud: 82
    },
    {
      id: 2,
      nombre: 'Papa',
      especie: 'Solanum tuberosum',
      ubicacion: 'Huerto',
      imagenUrl: '',
      estado: 'warn',
      estadoTexto: 'Necesita agua',
      riegoFrecuencia: 'Cada 2d',
      solTipo: 'Parcial',
      tempRango: '15-20°C',
      progresoRiego: 30,
      progresoSol: 90,
      progresoSalud: 74
    }
  ]);

  // ================= LÓGICA DE AGREGAR Y ELIMINAR =================

  abrirModal(): void {
    this.modalImagenUrl.set('');
    this.modalMetadatos.set(null); // Limpiamos los metadatos anteriores
    this.modalAbierto.set(true);
  }

  cerrarModal(): void {
    this.modalAbierto.set(false);
  }

  guardarPlanta(nombre: string, especie: string, ubicacion: string, riego: string): void {
    if (!nombre.trim() || !especie.trim()) {
      this.mensaje.set({ texto: 'Por favor, rellena el nombre y la especie obligatoriamente.', tipo: 'error' });
      return;
    }

    // Recuperamos los metadatos extraídos de la foto del modal (si existen)
    const metadatosFoto = this.modalMetadatos();

    const nuevaPlanta: Planta = {
      id: Date.now(),
      nombre: nombre,
      especie: especie,
      ubicacion: ubicacion,
      imagenUrl: this.modalImagenUrl(),
      estado: 'good',
      estadoTexto: 'Saludable',
      riegoFrecuencia: riego || 'Cada 3d',
      solTipo: 'Pleno',
      tempRango: '18-25°C',
      progresoRiego: 100,
      progresoSol: 100,
      progresoSalud: 100,
      // Si la foto tenía metadatos, los sembramos en la nueva planta
      fechaCaptura: metadatosFoto?.fecha,
      latitud: metadatosFoto?.latitud,
      longitud: metadatosFoto?.longitud
    };

    this.plantas.update(lista => [...lista, nuevaPlanta]);
    this.cerrarModal();
    this.mensaje.set({ texto: `¡${nombre} se ha registrado correctamente!`, tipo: 'ok' });
  }

  eliminarPlanta(id: number): void {
    this.plantas.update(lista => lista.filter(p => p.id !== id));
    this.mensaje.set({ texto: 'Planta eliminada de tu colección.', tipo: 'ok' });
  }

  // ================= MULTIMEDIA E INTERACCIONES =================

  // Procesa la imagen cargada dentro del Modal extrayendo los datos EXIF
  async onModalFotoSeleccionada(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Previsualización de la imagen
      const reader = new FileReader();
      reader.onload = () => this.modalImagenUrl.set(reader.result as string);
      reader.readAsDataURL(file);

      // Extracción de metadatos mediante tu servicio
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

  // Procesa la imagen cargada desde la tarjeta actualizándole sus datos EXIF individuales
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

        // 🔥 AQUÍ AGREGAMOS EL AVISO EN PANTALLA IGUAL AL DE ÁNGEL:
        const climaTemp = this.climaActual()?.temperatura || 15;
        const climaDesc = this.climaActual()?.descripcion || 'Fresco / nublado';
        
        let horaFormateada = '00:00';
        if (exifDetectado?.fecha instanceof Date) {
          horaFormateada = exifDetectado.fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        // Desplegamos el cuadro de texto flotante
        alert(`De acuerdo a esta foto tomada a las ${horaFormateada} horas, el clima estuvo a ${climaTemp}°C (${climaDesc}) y tuvo una exposición solar aproximada muy alta (Índice UV 9).`);

      } catch (err) {
        console.error('Error crítico al actualizar el signal de plantas:', err);
      }
    };
    
    reader.readAsDataURL(file);
  }

  // Simula la actualización en tiempo real de los datos del clima
  actualizarClimaActual(): void {
    this.cargandoClima.set(true);
    setTimeout(() => {
      this.cargandoClima.set(false);
      this.climaActual.set({
        temperatura: 17,
        descripcion: 'Templado / Parcialmente Soleado',
        sensacionTermica: 17,
        hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        icono: 'fa-cloud-sun',
        color: '#FDA769'
      });
    }, 1000);
  }

  cerrarMensaje(): void { this.mensaje.set(null); }
  mesAnterior(): void { console.log('Mes anterior'); }
  mesSiguiente(): void { console.log('Mes siguiente'); }

  diasDelMes(planta: Planta): any[] {
    return Array.from({ length: 30 }, (_, i) => ({
      numero: i + 1,
      claveFecha: `dia-${i + 1}`,
      fueraDeMes: false,
      esHoy: i === 4,
      esFuturo: i > 4,
      cuidadoHecho: i < 4 && i % 2 === 0
    }));
  }

  textoUltimoCuidado(planta: Planta): string {
    return planta.id === 1 ? 'Hoy' : 'Sin registros aún';
  }
}