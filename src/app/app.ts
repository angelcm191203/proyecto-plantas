import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header'; // 1. Importa el componente

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent], // 2. Agrégalo a los imports
  template: `
    <app-header></app-header> <!-- 3. Pon la etiqueta aquí -->
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  title = 'ProyectoPlantas';
}