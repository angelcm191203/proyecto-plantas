const express = require('express');
const cors = require('cors');
const db = require('./db');
const routes = require('./routes'); // Importamos las rutas

const app = express();

app.use(cors());
app.use(express.json());

// Usamos las rutas que creamos
app.use('/api', routes);

// Ruta de prueba para verificar la conexión con la base de datos
app.get('/api/test', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.json({ mensaje: 'Conexión exitosa', fecha_bd: result.rows[0].now });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});