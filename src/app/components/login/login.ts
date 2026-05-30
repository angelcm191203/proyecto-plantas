import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  isSignUpMode: boolean = false;
  
  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // Formulario de Inicio de Sesión
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Formulario de Registro
    this.registerForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      ubicacion: ['', Validators.required] // API de clima pendiente!!!!!
    });
  }

  // Alterna el estado para disparar la animación de deslizamiento
  toggleMode(signUp: boolean) {
    this.isSignUpMode = signUp;
  }

  onLoginSubmit() {
    if (this.loginForm.valid) {
      console.log('Login data:', this.loginForm.value);
      alert('¡Ingresando al sistema!');
      // enrutamiento a /mis-plantas pendiente!!!
    } else {
      alert('Por favor, ingresa credenciales válidas.');
    }
  }

  onRegisterSubmit() {
    if (this.registerForm.valid) {
      console.log('Register data:', this.registerForm.value);
      alert('¡Cuenta creada con éxito! Ya puedes iniciar sesión.');
      this.isSignUpMode = false; // Te regresa al login automáticamente
    } else {
      alert('Por favor, completa todos los campos del registro.');
    }
  }
}