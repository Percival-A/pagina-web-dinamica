// Importamos las bibliotecas necesarias.
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

// Inicializamos nuestra aplicación Express.
const app = express();
// Definimos el puerto donde se ejecutará nuestro servidor.
const PORT = process.env.PORT || 3000;

// Configuramos middleware:

// bodyParser nos permite leer datos en formato JSON desde el cuerpo de las peticiones.
app.use(bodyParser.json());
// express.static nos permite servir archivos estáticos (HTML, CSS, JS) desde una carpeta 'public'.
app.use(express.static('public'));

// Configuramos nuestra base de datos SQLite:
// Establecemos la conexión a una base de datos local llamada 'database.db'. Si no existe, se creará.
const db = new sqlite3.Database('./.data/database.db', (err) => {
    if (err) {
        // Si hay un error al conectar, lo mostramos.
        return console.error(err.message);
    }
    console.log('Conexión exitosa a la base de datos SQLite.');

    // Una vez conectados, intentamos crear la tabla si no existe.
    db.run(`CREATE TABLE IF NOT EXISTS data (
        id TEXT PRIMARY KEY,
        value TEXT NOT NULL
    )`, (tableErr) => {
        if (tableErr) {
            // Si hay un error al crear la tabla, lo mostramos.
            console.error(tableErr.message);
        }
    });
});

// Rutas del servidor:

// Ruta POST para guardar datos en la base de datos.
app.post('/save', (req, res) => {
    const { id, data } = req.body;  // Extraemos 'id' y 'data' del cuerpo de la petición.

    // Preparamos nuestra consulta SQL para insertar o actualizar datos.
    const stmt = db.prepare("INSERT OR REPLACE INTO data (id, value) VALUES (?, ?)");

    // Ejecutamos la consulta con los valores proporcionados.
    stmt.run([id, data], (err) => {
        if (err) {
            // Si hay un error al guardar, enviamos una respuesta con el error.
            res.json({ success: false, message: err.message });
        } else {
            // Si todo va bien, enviamos una respuesta de éxito.
            res.json({ success: true });
        }
    });
    stmt.finalize();  // Finalizamos la consulta.
});

// Ruta GET para buscar datos por ID.
app.get('/fetch/:id', (req, res) => {
    const { id } = req.params;  // Extraemos el 'id' de los parámetros de la URL.

    // Preparamos nuestra consulta SQL para buscar datos por ID.
    db.get("SELECT value FROM data WHERE id = ?", [id], (err, row) => {
        if (err) {
            // Si hay un error al buscar, enviamos una respuesta con el error.
            res.json({ success: false, message: err.message });
        } else if (row) {
            // Si encontramos un registro, enviamos los datos encontrados.
            res.json({ success: true, data: row.value });
        } else {
            // Si no encontramos nada, enviamos un mensaje indicando que no hay datos.
            res.json({ success: false, message: 'No data found' });
        }
    });
});

// Iniciamos el servidor en el puerto especificado.
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Manejo de cierre del servidor:
// Aseguramos que, al cerrar la aplicación, también se cierre la conexión a la base de datos.
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Cierre de la conexión a la base de datos.');
        process.exit(1);
    });
});
