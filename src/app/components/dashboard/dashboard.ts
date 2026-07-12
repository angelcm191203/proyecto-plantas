import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {
  // 💡 ¡CAMBIO AQUÍ! Cambiamos 'agregar' por 'clima' para que coincida con tu nueva pantalla de inicio
  seccionActiva: string = 'clima'; 

  constructor(private router: Router) {}

  navegar(ruta: string): void {
    this.seccionActiva = ruta;

    switch (ruta) {
      case 'clima':
        this.router.navigate(['/dashboard/clima']);
        break;
      case 'mis-plantas':
        this.router.navigate(['/dashboard/mis-plantas']); 
        break;
      case 'agregar':
        this.router.navigate(['/dashboard/agregar']);
        break;
      case 'bitacora':
        this.router.navigate(['/dashboard/bitacora']);
        break;
      default:
        console.log('Ruta no reconocida:', ruta);
    }
  }

  cerrarSesion(): void {
    console.log('Cerrando sesión...');
    this.router.navigate(['/login']);
  }
}