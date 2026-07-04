import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; // <-- 1. IMPORTA EL ROUTERLINK

@Component({
  selector: 'app-inicio',
  imports: [RouterLink], // <-- 2. AGRÉGALO AQUÍ
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class InicioComponent {}