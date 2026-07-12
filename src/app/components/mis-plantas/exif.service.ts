import { Injectable } from '@angular/core';
import { parse as parseExif } from 'exifr';

export interface ResultadoExif {
  fecha: Date | undefined;
  latitud?: number;
  longitud?: number;
}

@Injectable({ providedIn: 'root' })
export class ExifService {
  async leerMetadatos(archivo: File): Promise<ResultadoExif> {
    const datos: any = await parseExif(archivo, [
      'DateTimeOriginal',
      'CreateDate',
      'GPSLatitude',
      'GPSLongitude',
    ]);

    const fecha: Date | undefined = datos?.DateTimeOriginal ?? datos?.CreateDate;

    return {
      fecha,
      latitud: datos?.latitude ?? datos?.GPSLatitude,
      longitud: datos?.longitude ?? datos?.GPSLongitude,
    };
  }

  async leerFecha(archivo: File): Promise<Date | undefined> {
    const { fecha } = await this.leerMetadatos(archivo);
    return fecha;
  }
}