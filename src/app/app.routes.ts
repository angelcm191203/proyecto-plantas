import { Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio';
import { LoginComponent } from './components/login/login';
import { DashboardComponent } from './components/dashboard/dashboard';
import { Credenciales } from './administradores/admin/credenciales/credenciales';
import { Peticiones } from './administradores/admin/peticiones/peticiones';
import { adminGuard } from './service/auth.guard';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';

// Importaciones de tus componentes hijos del Dashboard
import { HistoricoPlantas } from './components/historico-plantas/historico-plantas';
import { NuevaPlantaComponent } from './components/nueva-planta/nueva-planta'; 
import { MisPlantasComponent } from './components/mis-plantas/mis-plantas';
import { ClimaComponent } from './components/clima/clima'; // 👈 1. IMPORTAMOS EL NUEVO COMPONENTE DEL CLIMA

export const routes: Routes = [
  // 1. Ruta de administrador primero para mayor prioridad
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard], 
    children: [
      { path: '', redirectTo: 'credenciales', pathMatch: 'full' },
      { path: 'credenciales', component: Credenciales },
      { path: 'peticiones', component: Peticiones }
    ]
  },
  // 2. Rutas estándar
  { path: 'login', component: LoginComponent },
  
  // 2.A Estructura del Dashboard con sus secciones internas vinculadas 🎛️
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    children: [
      // 💡 ¡CAMBIO AQUÍ! Al entrar a /dashboard, ahora te redirige directo al clima por defecto
      { path: '', redirectTo: 'clima', pathMatch: 'full' }, 
      
      // Los caminos correspondientes a tus botones:
      { path: 'agregar', component: NuevaPlantaComponent }, 
      { path: 'bitacora', component: HistoricoPlantas },   
      
      // 💡 ¡CORREGIDO AQUÍ! Vinculamos la ruta con tu nuevo ClimaComponent del gatito negro
      { path: 'clima', component: ClimaComponent },        
      { path: 'mis-plantas', component: MisPlantasComponent }  
    ]
  },

  { path: '', component: InicioComponent },
  // 3. Comodín al final
  { path: '**', redirectTo: '' }
];