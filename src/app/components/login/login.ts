import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
  // Esta es la variable que controla el diseño que hizo tu compañero
  isSignUpMode: boolean = false; 

  // Definición básica de formularios (por si los necesitas inicializar)
  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  registerForm = new FormGroup({
    nombre: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    ubicacion: new FormControl('')
  });

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    // Escuchamos si vienen desde "Crear cuenta" o "Iniciar sesión"
    this.route.queryParams.subscribe(params => {
      if (params['modo'] === 'registro') {
        this.isSignUpMode = true; // Activa la animación hacia el formulario de registro
      } else {
        this.isSignUpMode = false; // Mantiene el formulario de login normal
      }
    });
  }

  // Función para cambiar de modo al interactuar con los botones internos transparentes
  toggleMode(isSignUp: boolean) {
    this.isSignUpMode = isSignUp;
  }

  onLoginSubmit() {
    console.log('Login data:', this.loginForm.value);
  }

  onRegisterSubmit() {
    console.log('Register data:', this.registerForm.value);
  }
}