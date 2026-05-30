import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { MisPlantas } from './components/mis-plantas/mis-plantas';
import { NuevaPlanta } from './components/nueva-planta/nueva-planta';
import { HistoricoPlantas } from './components/historico-plantas/historico-plantas';

export const routes: Routes = [
  // Pantalla inicial por defecto (Redirige al Login)
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Ruta para el Login
  { path: 'login', component: LoginComponent},

  // Ruta para el Dashboard (Mis Plantas)
  { path: 'mis-plantas', component: MisPlantas },

  // Ruta para Registrar una Nueva Planta
  { path: 'nueva-planta', component: NuevaPlanta },

  // Ruta para el Histórico / Bitácora
  { path: 'historico', component: HistoricoPlantas },

  // Comodín por si escriben cualquier otra cosa
  { path: '**', redirectTo: 'login' }
];