import { Routes } from '@angular/router';
import { Inicio } from './components/inicio/inicio'; // <-- 1. AÑADE ESTA IMPORTACIÓN
import { LoginComponent } from './components/login/login';
import { MisPlantas } from './components/mis-plantas/mis-plantas';
import { NuevaPlanta } from './components/nueva-planta/nueva-planta';
import { HistoricoPlantas } from './components/historico-plantas/historico-plantas';

export const routes: Routes = [
  // 2. MODIFICA ESTA RUTA: Ahora la pantalla inicial por defecto será el Inicio
  { path: '', component: Inicio },

  // Ruta para el Login (aquí llegarán al pulsar los botones de inicio o crear cuenta)
  { path: 'login', component: LoginComponent},

  // Ruta para el Dashboard (Mis Plantas)
  { path: 'mis-plantas', component: MisPlantas },

  // Ruta para Registrar una Nueva Planta
  { path: 'nueva-planta', component: NuevaPlanta },

  // Ruta para el Histórico / Bitácora
  { path: 'historico', component: HistoricoPlantas },

  // 3. MODIFICA EL COMODÍN: Si escriben una ruta inexistente, los regresa al inicio
  { path: '**', redirectTo: '' }
];