import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface PublicacionBitacora {
  id: string;
  plantaId: string;
  nombrePlanta: string;
  fecha: string;
  etapa: string;
  puntuacion: number;
  descripcion: string;
  imagen?: string | null;
  tags: string[];
}

export interface GrupoPlanta {
  nombrePlanta: string;
  publicaciones: PublicacionBitacora[];
  ultimaFoto: string | null;
  ultimaDescripcion: string;
  ultimaFecha: string;
}

@Component({
  selector: 'app-historico-plantas',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './historico-plantas.html',
  styleUrls: ['./historico-plantas.css']
})
export class HistoricoPlantas implements OnInit {

  plantaSeleccionada: GrupoPlanta | null = null;
  mostrarFormulario: boolean = false;
  terminoBusqueda: string = '';
  filtroEtapa: string = 'Todos';
  imagenSeleccionada: string | null = null;

  bitacoraForm!: FormGroup;

  plantas: any[] = [];
  publicaciones: PublicacionBitacora[] = [];

  listaEtiquetas = [
    { emoji: '💧', nombre: 'Riego', seleccionada: false },
    { emoji: '☀️', nombre: 'Sol', seleccionada: false },
    { emoji: '🌱', nombre: 'Crecimiento', seleccionada: false },
    { emoji: '🌸', nombre: 'Floración', seleccionada: false },
    { emoji: '🧪', nombre: 'Fertilizante', seleccionada: false },
    { emoji: '✂️', nombre: 'Poda', seleccionada: false },
    { emoji: '🪴', nombre: 'Trasplante', seleccionada: false },
    { emoji: '⛅', nombre: 'Clima', seleccionada: false },
    { emoji: '🍓', nombre: 'Frutos', seleccionada: false },
    { emoji: '🍃', nombre: 'Hojas', seleccionada: false },
    { emoji: '🪵', nombre: 'Semillas', seleccionada: false }
  ];

  constructor(
    private fb: FormBuilder,
    public cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarDatosLocalStorage();
  }

  cargarDatosLocalStorage(): void {
    const plantasGuardadas = localStorage.getItem('plantas_bitacora');
    if (plantasGuardadas) {
      this.plantas = JSON.parse(plantasGuardadas);
    }

    const pubGuardadas = localStorage.getItem('publicaciones_bitacora');
    if (pubGuardadas) {
      this.publicaciones = JSON.parse(pubGuardadas);
    }
  }

  initForm(): void {
    this.bitacoraForm = this.fb.group({
      plantaExistenteId: ['', Validators.required],
      etapa: ['', Validators.required],
      puntuacion: [1, Validators.required], // Inicia por defecto en 1 estrella
      descripcion: ['', Validators.required]
    });
  }

  getArrayEstrellas(puntuacion: number): number[] {
    return [1, 2, 3, 4, 5];
  }

  // 🌿 Texto explicativo enfocado 100% en el estado agrícola del cultivo
  getTextoSalud(puntuacion: number): string {
    switch (Number(puntuacion)) {
      case 5: return 'Planta vigorosa y en óptimas condiciones';
      case 4: return 'Buen crecimiento y hojas saludables';
      case 3: return 'Desarrollo estable y normal';
      case 2: return 'Muestra signos de estrés o crecimiento lento';
      case 1: return 'Requiere atención o cuidados especiales';
      default: return 'Estado del cultivo';
    }
  }

  get publicacionesFiltradas(): PublicacionBitacora[] {
    const busqueda = (this.terminoBusqueda || '').trim().toLowerCase();

    return this.publicaciones.filter(pub => {
      const coincideBusqueda = !busqueda || 
        pub.nombrePlanta.toLowerCase().includes(busqueda) ||
        pub.descripcion.toLowerCase().includes(busqueda) ||
        pub.etapa.toLowerCase().includes(busqueda) ||
        pub.tags.some(tag => tag.toLowerCase().includes(busqueda));

      if (busqueda.length > 0) {
        return coincideBusqueda;
      }

      const coincideEtapa = this.filtroEtapa === 'Todos' || pub.etapa === this.filtroEtapa;
      return coincideEtapa;
    });
  }

  get plantasAgrupadas(): GrupoPlanta[] {
    const grupos: { [key: string]: GrupoPlanta } = {};

    this.publicacionesFiltradas.forEach(pub => {
      if (!grupos[pub.nombrePlanta]) {
        grupos[pub.nombrePlanta] = {
          nombrePlanta: pub.nombrePlanta,
          publicaciones: [],
          ultimaFoto: null,
          ultimaDescripcion: '',
          ultimaFecha: ''
        };
      }

      grupos[pub.nombrePlanta].publicaciones.push(pub);

      if (pub.imagen) {
        grupos[pub.nombrePlanta].ultimaFoto = pub.imagen;
      }
      grupos[pub.nombrePlanta].ultimaDescripcion = pub.descripcion;
      grupos[pub.nombrePlanta].ultimaFecha = pub.fecha;
    });

    return Object.values(grupos);
  }

  verHiloPlanta(grupo: GrupoPlanta): void {
    this.plantaSeleccionada = grupo;
  }

  eliminarPublicacion(pub: PublicacionBitacora, event: Event): void {
    event.stopPropagation();
    
    if (confirm('¿Deseas eliminar este registro de la bitácora?')) {
      this.publicaciones = this.publicaciones.filter(p => p.id !== pub.id);

      if (this.plantaSeleccionada) {
        this.plantaSeleccionada.publicaciones = this.plantaSeleccionada.publicaciones.filter(p => p.id !== pub.id);

        if (this.plantaSeleccionada.publicaciones.length === 0) {
          this.plantaSeleccionada = null;
        }
      }
      localStorage.setItem('publicaciones_bitacora', JSON.stringify(this.publicaciones));
    }
  }

  filtrarPorEtapa(etapa: string): void {
    this.filtroEtapa = etapa;
  }

  abrirNuevoPost(): void {
    this.cargarDatosLocalStorage();
    this.mostrarFormulario = true;
  }

  cerrarFormulario(): void {
    this.cancelar();
  }

  cancelar(): void {
    this.bitacoraForm.reset({ 
      puntuacion: 1, 
      plantaExistenteId: '', 
      etapa: '', 
      descripcion: '' 
    });
    this.imagenSeleccionada = null;
    this.listaEtiquetas.forEach(t => t.seleccionada = false);
    this.mostrarFormulario = false;
  }

  toggleEtiqueta(index: number): void {
    this.listaEtiquetas[index].seleccionada = !this.listaEtiquetas[index].seleccionada;
  }

  enArchivoSeleccionado(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenSeleccionada = e.target.result;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    }
  }

  quitarFoto(): void {
    this.imagenSeleccionada = null;
  }

  guardarRegistro(): void {
    if (this.bitacoraForm.invalid) {
      this.bitacoraForm.markAllAsTouched();
      return;
    }

    const formValues = this.bitacoraForm.value;
    const plantaObjeto = this.plantas.find(p => p.id == formValues.plantaExistenteId);

    const tagsSeleccionados = this.listaEtiquetas
      .filter(t => t.seleccionada)
      .map(t => `${t.emoji} ${t.nombre}`);

    const nuevaPublicacion: PublicacionBitacora = {
      id: Date.now().toString(),
      plantaId: formValues.plantaExistenteId,
      nombrePlanta: plantaObjeto ? plantaObjeto.nombre : 'Planta',
      fecha: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
      etapa: formValues.etapa,
      puntuacion: Number(formValues.puntuacion) || 1,
      descripcion: formValues.descripcion,
      imagen: this.imagenSeleccionada,
      tags: tagsSeleccionados
    };

    this.publicaciones.unshift(nuevaPublicacion);

    localStorage.setItem('publicaciones_bitacora', JSON.stringify(this.publicaciones));

    if (this.plantaSeleccionada && this.plantaSeleccionada.nombrePlanta === nuevaPublicacion.nombrePlanta) {
      this.plantaSeleccionada.publicaciones.unshift(nuevaPublicacion);
    }

    this.cerrarFormulario();
  }

}