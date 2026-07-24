-- Usuarios (Registro, Login, Ubicación y Roles)
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(150) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    ubicacion VARCHAR(100),
    rol VARCHAR(50) DEFAULT 'Usuario',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Plantas (Catálogo y climas ideales)
DROP TABLE IF EXISTS plantas CASCADE;

CREATE TABLE plantas (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    especie VARCHAR(100),
    etapa_desarrollo VARCHAR(100),
    ubicacion VARCHAR(100),
    imagen_url TEXT,
    riego_frecuencia VARCHAR(50)
);
-- Monitoreo (Indicadores en tiempo real: riego, sol, salud)
CREATE TABLE monitoreo_plantas (
    id_monitoreo SERIAL PRIMARY KEY,
    id_planta INT REFERENCES plantas(id_planta) ON DELETE CASCADE,
    riego INT CHECK (riego >= 0 AND riego <= 100),
    exposicion_solar INT CHECK (exposicion_solar >= 0 AND exposicion_solar <= 100),
    salud_general INT CHECK (salud_general >= 0 AND salud_general <= 100),
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Peticiones de Plantas (Solicitudes de nuevas especies por los usuarios)
CREATE TABLE peticiones_plantas (
    id_peticion SERIAL PRIMARY KEY,
    nombre_planta VARCHAR(100) NOT NULL,
    motivo_solicitud TEXT NOT NULL,
    solicitado_por INT REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    estado VARCHAR(20) DEFAULT 'Pendiente',
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bitácora de Cultivos (Entradas, notas y etiquetas de avance)
CREATE TABLE bitacora_cultivos (
    id_bitacora SERIAL PRIMARY KEY,
    nombre_cultivo VARCHAR(100) NOT NULL,
    etapa_actual VARCHAR(50) NOT NULL,
    descripcion_notas TEXT NOT NULL,
    fotografia_url TEXT,
    etiquetas_accion VARCHAR(255),
    id_usuario INT REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    fecha_entrada TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);