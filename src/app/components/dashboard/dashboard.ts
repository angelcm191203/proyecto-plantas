import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NuevaPlantaComponent } from '../nueva-planta/nueva-planta';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NuevaPlantaComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {}