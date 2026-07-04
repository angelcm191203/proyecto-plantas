import { Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio';
import { LoginComponent } from './components/login/login';
import { DashboardComponent } from './components/dashboard/dashboard';
import { Credenciales } from './administradores/admin/credenciales/credenciales';
import { Peticiones } from './administradores/admin/peticiones/peticiones';
import { adminGuard } from './service/auth.guard';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';

export const routes: Routes = [
  // 1. Ruta de administrador primero para mayor prioridad
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard], // Cuando verifiques que carga, quita el comentario
    children: [
      { path: '', redirectTo: 'credenciales', pathMatch: 'full' },
      { path: 'credenciales', component: Credenciales },
      { path: 'peticiones', component: Peticiones }
    ]
  },
  // 2. Rutas estándar
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '', component: InicioComponent },
  // 3. Comodín al final
  { path: '**', redirectTo: '' }
];