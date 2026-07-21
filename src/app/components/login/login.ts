import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth.service';

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
    private auth: AuthService,
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

      if (password === '123456') {
        if (email === 'angel@weatherplant.com') {
          this.auth.iniciarSesion('Angel');
        } else if (email === 'michel@weatherplant.com') {
          this.auth.iniciarSesion('Michel');
        } else {
          this.auth.iniciarSesion('UsuarioCliente');
        }

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
      const datosRegistro = {
        ...this.registerForm.value,
        avatar: this.avatarSeleccionado
      };
      console.log('Datos de registro con avatar:', datosRegistro);
      alert(`¡Registro simulado con éxito! Avatar elegido: ${this.avatarSeleccionado}. Ahora puedes iniciar sesión.`);
      this.isSignUpMode = false;
    } else {
      alert('Por favor, completa todos los campos del formulario de registro.');
    }
  }
}