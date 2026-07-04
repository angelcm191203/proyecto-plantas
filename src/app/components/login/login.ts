import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service'; // Importa tu servicio

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  isSignUpMode: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private auth: AuthService 
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      ubicacion: ['', [Validators.required]]
    });
  }

  toggleMode(status: boolean): void {
    this.isSignUpMode = status;
  }

  onLoginSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      if (password === '123456') {
        if (email === 'angel@weatherplant.com') {
          this.auth.iniciarSesion('Angel');
        } else if (email === 'michel@weatherplant.com') {
          this.auth.iniciarSesion('Michel');
        } else {
          this.auth.iniciarSesion('UsuarioCliente');
        }

        // Aquí está el cambio: redirigimos a la nueva ruta /admin/credenciales
        if (this.auth.esAdministrador()) {
          this.router.navigate(['/admin/credenciales']); 
        } else {
          this.router.navigate(['/dashboard']);
        }
      } else {
        alert('Credenciales incorrectas.');
      }
    }
  }

  onRegisterSubmit(): void {
    if (this.registerForm.valid) {
      console.log('Datos de registro:', this.registerForm.value);
      alert('Registro simulado con éxito. Ahora puedes iniciar sesión.');
      this.isSignUpMode = false;
    } else {
      alert('Por favor, completa todos los campos del formulario de registro.');
    }
  }
}