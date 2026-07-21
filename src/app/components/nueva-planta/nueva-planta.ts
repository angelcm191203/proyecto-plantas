import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nueva-planta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nueva-planta.html',
  styleUrls: ['./nueva-planta.css']
})
export class NuevaPlantaComponent {
  mostrarFormulario = false;

  catalogoPlantas = [
    { nombre: 'Cebolla', clima: 'Templado / Fresco (12-24°C)', imagen: 'planta8.jpg' },
    { nombre: 'Habanero', clima: 'Cálido / Tropical (20-32°C)', imagen: 'planta11.jpg' },
    { nombre: 'Ajo', clima: 'Templado / Frío moderado', imagen: 'planta5.jpg' },
    { nombre: 'Chile', clima: 'Cálido y Soleado (18-30°C)', imagen: 'planta1.jpg' },
    { nombre: 'Coliflor', clima: 'Templado / Fresco (15-20°C)', imagen: 'planta4.jpg' },
    { nombre: 'Elote', clima: 'Cálido / Templado (21-27°C)', imagen: 'planta10.jpg' },
    { nombre: 'Jitomate', clima: 'Templado-Cálido (20-26°C)', imagen: 'planta6.jpg' },
    { nombre: 'Fresa', clima: 'Templado / Moderado (15-22°C)', imagen: 'planta9.jpg' }
  ];

  abrirModal(): void {
    this.mostrarFormulario = true;
  }

  cerrarModal(): void {
    this.mostrarFormulario = false;
  }

  enviarSolicitud(event: Event): void {
    event.preventDefault();
    alert('¡Solicitud enviada al Administrador!');
    this.cerrarModal();
  }

  filtrarCatalogo(termino: string): void {
    // Lógica para filtrar las tarjetas en base al texto ingresado
    const texto = termino.toLowerCase().trim();
    const tarjetas = document.querySelectorAll('.plant-card');

    tarjetas.forEach((tarjeta: any) => {
      const titulo = tarjeta.querySelector('h3').textContent.toLowerCase();
      if (titulo.includes(texto)) {
        tarjeta.style.display = 'block';
      } else {
        tarjeta.style.display = 'none';
      }
    });
  }

  agregarAlHuerto(nombrePlanta: string, event: Event): void {
    const boton = event.target as HTMLButtonElement;
    boton.textContent = '¡Agregada!';
    boton.style.background = '#166534';
    boton.disabled = true;
    
    console.log(`Planta agregada al huerto virtual: ${nombrePlanta}`);
  }
}