import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export const adminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.esAdministrador()) {
    return true;
  } else {
    // CAMBIO AQUÍ: Ahora enviará al usuario al login en lugar del dashboard
    router.navigate(['/login']); 
    return false;
  }
};