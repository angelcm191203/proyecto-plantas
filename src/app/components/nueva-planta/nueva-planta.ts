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
    { nombre: 'Tomate', tipo: 'Hortaliza 🍅', imagen: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400' },
    { nombre: 'Albahaca', tipo: 'Hierba Aromática 🌿', imagen: 'https://images.unsplash.com/photo-1594488301548-5256e2eb9753?w=400' },
    { nombre: 'Lechuga', tipo: 'Hortaliza 🥬', imagen: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400' },
    { nombre: 'Menta', tipo: 'Hierba Aromática 🌱', imagen: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=400' },
    { nombre: 'Chile Serrano', tipo: 'Hortaliza 🌶️', imagen: 'https://images.unsplash.com/photo-1566821582776-92b6d015db77?w=400' }
  ];

  abrirModal(): void {
    this.mostrarFormulario = true;
  }

  cerrarModal(): void {
    this.mostrarFormulario = false;
  }

  // AÑADE ESTA FUNCIÓN:
  enviarSolicitud(event: Event): void {
    event.preventDefault();
    alert('¡Solicitud enviada al Administrador!');
    this.cerrarModal();
  }

  seleccionarPlanta(planta: any) {
    alert(`¡Has seleccionado añadir: ${planta.nombre}!`);
  }
}