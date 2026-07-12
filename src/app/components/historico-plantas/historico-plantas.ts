import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; 

@Component({
  selector: 'app-historico-plantas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './historico-plantas.html',
  styleUrl: './historico-plantas.css',
})
export class HistoricoPlantas {
  mostrarFormulario = false;
  isEditing = false;
  bitacoraForm: FormGroup;
  imagenSeleccionada: string | null = null;
  
  analizandoImagen = false;
  fotoBloqueada = false;

  // Nueva propiedad para controlar el filtro activo
  filtroActual = 'Todos';

  palabrasProhibidas: string[] = ['puto', 'pendejo', 'mierda', 'verga', 'pene', 'puta', 'culero', 'cabron', 'chinga'];

  listaEtiquetas = [
    { nombre: 'Riego', emoji: '💧', seleccionada: false },
    { nombre: 'Sol', emoji: '☀️', seleccionada: false },
    { nombre: 'Crecimiento', emoji: '🌱', seleccionada: false },
    { nombre: 'Floración', emoji: '🌸', seleccionada: false },
    { nombre: 'Fertilizante', emoji: '🧪', seleccionada: false },
    { nombre: 'Poda', emoji: '✂️', seleccionada: false },
    { nombre: 'Trasplante', emoji: '🪴', seleccionada: false },
    { nombre: 'Clima', emoji: '🌤️', seleccionada: false },
    { nombre: 'Frutos', emoji: '🍓', seleccionada: false },
    { nombre: 'Hojas', emoji: '🌿', seleccionada: false },
    { nombre: 'Semillas', emoji: '🫘', seleccionada: false }
  ];

  publicaciones: any[] = [];

  // CORREGIDO: Constructor con comas y tipos correctos inyectados


  abrirNuevoPost() {
    this.isEditing = false;
    this.mostrarFormulario = true;
    this.bitacoraForm.reset({ etapa: 'Seleccione una etapa' });
    this.imagenSeleccionada = null;
    this.fotoBloqueada = false;
    this.analizandoImagen = false;
    this.listaEtiquetas.forEach(t => t.seleccionada = false);
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
  }

  cancelar() {
    this.cerrarFormulario();
  }

  toggleEtiqueta(index: number) {
    this.listaEtiquetas[index].seleccionada = !this.listaEtiquetas[index].seleccionada;
  }

  // Nueva función para cambiar el filtro activo
  cambiarFiltro(etapa: string) {
    this.filtroActual = etapa;
    console.log('Filtrando por:', this.filtroActual);
  }

  // CORREGIDO: Función optimizada, asíncrona y con refresco forzado de Angular
  enArchivoSeleccionado(event: any) {
    const file = event.target.files[0];
    if (file) {
      const nombreArchivoLower = file.name.toLowerCase();
      const patronesBloqueados = ['gore', 'xxx', 'porno', 'death', 'sangre', 'muerte', 'naked', 'nude'];
      if (patronesBloqueados.some(patron => nombreArchivoLower.includes(patron))) {
        alert('⚠️ Archivo bloqueado: El nombre sugiere contenido inapropiado.');
        this.quitarFoto();
        return;
      }

      this.analizandoImagen = true;
      this.fotoBloqueada = false;
      this.cdr.detectChanges(); // Forzamos a Angular a prender el botón "Analizando..."

      const imgReader = new FileReader();
      imgReader.onload = (e: any) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 800;
          let w = img.width, h = img.height;
          
          if (w > h && w > maxDim) { h = (h * maxDim) / w; w = maxDim; }
          else if (h > maxDim) { w = (w * maxDim) / h; h = maxDim; }
          
          canvas.width = w; canvas.height = h;
          canvas.getContext('2d')?.drawImage(img, 0, 0, w, h);
          
          canvas.toBlob((blob) => {
            if (!blob) return;
            const archivoComprimido = new File([blob], 'optimizada.jpg', { type: 'image/jpeg' });

            const formData = new FormData();
            formData.append('media', archivoComprimido);
            formData.append('models', 'nudity,gore'); 
            formData.append('api_user', '1657018051');      
            formData.append('api_secret', 'uhbt838MP38qssijeKBUVxnNxYvxQCAG'); 

            this.http.post('https://api.sightengine.com/1.0/check.json', formData).subscribe({
              next: (res: any) => {
                this.analizandoImagen = false; 

                if (res.status === 'failure') {
                  alert(`⚠️ Error de la API: ${res.error.message}`);
                  this.quitarFoto();
                } else {
                  const raw = res.nudity?.raw || 0;
                  const partial = res.nudity?.partial || 0;
                  const gore = res.gore?.prob || 0;

                  // Filtro al 80% para evitar falsos positivos con fotos de cultivos
                  if (raw > 0.80 || partial > 0.80 || gore > 0.70) {
                    alert('🚨 Fotografía bloqueada por la inteligencia artificial: Contenido explícito detectado.');
                    this.quitarFoto();
                    this.fotoBloqueada = true;
                  } else {
                    console.log('¡Imagen limpia y aprobada! 🌱');
                    this.fotoBloqueada = false;
                    this.imagenSeleccionada = canvas.toDataURL('image/jpeg', 0.6);
                  }
                }
                
                this.cdr.detectChanges(); // Forzamos a Angular a apagar el botón verde
              },
              error: (err) => {
                this.analizandoImagen = false;
                console.error('Error completo de la API:', err);
                alert('Error al conectar con el servidor de análisis. Revisa la consola.');
                this.quitarFoto();
                this.cdr.detectChanges(); 
              }
            });
          }, 'image/jpeg', 0.6);
        };
        img.src = e.target.result;
      };
      imgReader.readAsDataURL(file);
    }
  }

  quitarFoto() {
    this.imagenSeleccionada = null;
    this.fotoBloqueada = false;
    this.analizandoImagen = false;
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
    this.cdr.detectChanges();
  }

// 1. Modifica tu constructor para que lea lo que ya tenías guardado al iniciar la página
  constructor(
    private http: HttpClient, 
    private cdr: ChangeDetectorRef
  ) {
    this.bitacoraForm = new FormGroup({
      nombre: new FormControl('', Validators.required),
      etapa: new FormControl('Seleccione una etapa', Validators.required),
      descripcion: new FormControl('', Validators.required)
    });

    // Jalamos las publicaciones que ya existían en la compu para que no se borren
    const guardadas = localStorage.getItem('publicaciones_bitacora');
    if (guardadas) {
      this.publicaciones = JSON.parse(guardadas);
    }
  }

  // 2. Modifica la parte final de tu función guardarRegistro
  guardarRegistro() {
    if (this.analizandoImagen) {
      alert('Espera un segundo, la inteligencia artificial está analizando tu imagen... 🛡️');
      return;
    }

    if (this.fotoBloqueada) {
      alert('No puedes guardar este registro. La imagen seleccionada no está permitida.');
      return;
    }

    if (this.bitacoraForm.valid && this.imagenSeleccionada) {
      const nombreInput = (this.bitacoraForm.value.nombre || '').toLowerCase();
      const descripcionInput = (this.bitacoraForm.value.descripcion || '').toLowerCase();

      const tieneGroserias = this.palabrasProhibidas.some(palabra => 
        nombreInput.includes(palabra) || descripcionInput.includes(palabra)
      );

      if (tieneGroserias) {
        alert('⚠️ Tu publicación contiene palabras obscenas o vulgares. Por favor, corrígelas para poder publicar.');
        return;
      }

      const tagsSeleccionados = this.listaEtiquetas
        .filter(t => t.seleccionada)
        .map(t => `${t.emoji} ${t.nombre}`);

      const nuevaPublicacion = {
        nombre: this.bitacoraForm.value.nombre,
        etapa: this.bitacoraForm.value.etapa,
        descripcion: this.bitacoraForm.value.descripcion,
        imagen: this.imagenSeleccionada,
        fecha: new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }),
        tags: tagsSeleccionados
      };

      // Metemos la publicación al inicio del arreglo
      this.publicaciones.unshift(nuevaPublicacion);
      
      // 🔥 LA MAGIA: Guardamos el arreglo completo en la memoria del navegador
      localStorage.setItem('publicaciones_bitacora', JSON.stringify(this.publicaciones));

      console.log('¡Publicación guardada con éxito en LocalStorage! 📦', nuevaPublicacion);
      
      this.cerrarFormulario();
      this.cdr.detectChanges(); // Forzamos a Angular a pintar la nueva tarjeta
    } else {
      alert('Por favor, llena todos los campos obligatorios y sube una fotografía.');
    }
  }
}