import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent {
  mostrarBoton = true;

  constructor(private router: Router) {
    // Escucha los cambios de navegación
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Usamos !includes para ocultar el botón si la URL contiene 'login'
        // Esto cubre tanto '/login' como '/login?modo-login'
        this.mostrarBoton = !event.url.includes('/login');
      }
    });
  }

  cerrarSesion(): void {
    alert('Sesión cerrada');
    this.router.navigate(['/login']);
  }
}