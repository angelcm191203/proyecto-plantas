import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../servicios/api';

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

  // Propiedades para el selector de avatares
  avataresDisponibles: string[] = ['🌱', '🌿', '🌻', '🌵'];
  avatarSeleccionado: string = '🌱'; // Avatar por defecto

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private apiService: ApiService,
    private route: ActivatedRoute
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

    this.route.queryParams.subscribe(params => {
      if (params['modo'] === 'registro') {
        this.isSignUpMode = true;
      } else {
        this.isSignUpMode = false;
      }
    });
  }

  toggleMode(status: boolean): void {
    this.isSignUpMode = status;
  }

  // Función para seleccionar el avatar
  seleccionarAvatar(avatar: string): void {
    this.avatarSeleccionado = avatar;
  }
onLoginSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      
      const credenciales = {
        correo: email,
        contrasena: password
      };

      this.apiService.loginUsuario(credenciales).subscribe({
        next: (res: any) => {
          console.log('Inicio de sesión exitoso:', res);
          alert('¡Bienvenido a WeatherPlant!');
          this.router.navigate(['/dashboard']);
        },
        error: (err: any) => {
          console.error('Error de autenticación en la BD:', err);
          alert('Correo o contraseña incorrectos.');
        }
      });
    } else {
      alert('Por favor, completa los campos del login.');
    }
  }

  onRegisterSubmit(): void {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;
      
      const datosRegistro = {
        nombre: formValue.nombre,
        correo: formValue.email,
        contrasena: formValue.password,
        ubicacion: formValue.ubicacion,
        avatar: this.avatarSeleccionado
      };

      this.apiService.registrarUsuario(datosRegistro).subscribe({
        next: (res: any) => {
          console.log('Usuario registrado con éxito en la BD:', res);
          alert(`¡Registro exitoso! Avatar elegido: ${this.avatarSeleccionado}. Ahora puedes iniciar sesión.`);
          this.isSignUpMode = false;
          this.registerForm.reset();
        },
        error: (err: any) => {
          console.error('Error al registrar usuario en la BD:', err);
          alert('Hubo un error al registrarse en la base de datos.');
        }
      });
    } else {
      alert('Por favor, completa todos los campos del formulario de registro.');
    }
  }
}