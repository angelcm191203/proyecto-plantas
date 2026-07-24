const express = require('express');
const router = express.Router();
const pool = require('./db'); // Asegúrate de que apunta a tu archivo de conexión de PostgreSQL

// Ruta de prueba
router.get('/test', async (req, res) => {
    try {
        res.json({ mensaje: 'API funcionando correctamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Ruta para obtener todos los usuarios
router.get('/usuarios', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM usuarios');
        res.json(resultado.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

// Ruta para registrar un nuevo usuario
router.post('/usuarios', async (req, res) => {
    try {
        const { nombre, correo, contrasena, ubicacion } = req.body;
        const resultado = await pool.query(
            'INSERT INTO usuarios (nombre, correo, contrasena, ubicacion) VALUES ($1, $2, $3, $4) RETURNING *',
            [nombre, correo, contrasena, ubicacion]
        );
        res.status(201).json(resultado.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message || 'Error al registrar usuario' });
    }
});

// Ruta para iniciar sesión validando contra PostgreSQL
router.post('/usuarios/login', async (req, res) => {
    try {
        const { correo, contrasena } = req.body;
        const resultado = await pool.query(
            'SELECT * FROM usuarios WHERE correo = $1 AND contrasena = $2',
            [correo, contrasena]
        );

        if (resultado.rows.length > 0) {
            res.json({ mensaje: 'Login exitoso', usuario: resultado.rows[0] });
        } else {
            res.status(401).json({ error: 'Correo o contraseña incorrectos' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// ================= SECCIÓN DE PLANTAS =================

// Ruta para obtener todas las plantas
router.get('/plantas', async (req, res) => {
    try {
        const resultado = await pool.query('SELECT * FROM plantas');
        res.json(resultado.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener las plantas' });
    }
});

// Ruta para registrar una nueva planta
router.post('/plantas', async (req, res) => {
    try {
        const { nombre, especie, etapaDesarrollo, ubicacion, imagenUrl, riegoFrecuencia } = req.body;
        const resultado = await pool.query(
            `INSERT INTO plantas (nombre, especie, etapa_desarrollo, ubicacion, imagen_url, riego_frecuencia) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [nombre, especie, etapaDesarrollo, ubicacion, imagenUrl, riegoFrecuencia]
        );
        res.status(201).json(resultado.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message || 'Error al guardar la planta' });
    }
});

// Ruta para eliminar una planta por ID
router.delete('/plantas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM plantas WHERE id = $1', [id]);
        res.json({ mensaje: 'Planta eliminada correctamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar la planta' });
    }
});

module.exports = router;