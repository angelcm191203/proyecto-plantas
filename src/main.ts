import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app'; // <--- Ruta corregida aquí

// Importa los datos de localización en español
import { registerLocaleData } from '@angular/common';
import localeEsMx from '@angular/common/locales/es-MX';

registerLocaleData(localeEsMx);

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));