import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Simulamos al usuario actual (esto cambiará cuando conectes tu login real)
  private usuarioActual = { nombre: 'Angel' }; 
  
  // Lista de usuarios que tienen permisos de administrador
  private administradores = ['Angel', 'Michel'];

  // Verifica si el usuario actual es administrador
// En tu auth.service.ts
iniciarSesion(nombre: string) {
  this.usuarioActual.nombre = nombre;
}

esAdministrador(): boolean {
  return this.administradores.includes(this.usuarioActual.nombre);
}
}
