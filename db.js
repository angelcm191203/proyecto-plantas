const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: 'postgres',          
    host: 'localhost',
    database: 'weatherplant_db',
    password: '1201',  //NO SE TE OLVIDE CAMBIAR LA CONTRASEÑA SI LA TIENES DIFERENTE
    port: 5432,
});

pool.connect()
    .then(() => console.log('Base de datos conectada con éxito a weatherplant_db'))
    .catch(err => console.error('Error de conexión a la base de datos', err));

module.exports = {
    query: (text, params) => pool.query(text, params),
};