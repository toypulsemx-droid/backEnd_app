const express = require('express');
const cors = require('cors');

const codeRoutes = require('./Routes/routesCode');
const cloudRoutes = require('./Routes/routeCloud');
const clipRoutes = require('./Routes/routesClip');

const app = express();

// ============================
// Configuración CORS
// ============================
// Permite distintos orígenes según entorno
const whitelist = [
  'http://localhost:5173',          // frontend en local
  'https://jade-jelly-bba4f6.netlify.app/'  // frontend en producción
];

app.use(cors({
  origin: function(origin, callback) {
    // Permitir requests sin origen (por ejemplo Postman)
    if (!origin) return callback(null, true);
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS no permitido por el servidor'));
    }
  },
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
}));

// Para manejar preflight requests automáticamente
app.options('*', cors({
  origin: whitelist,
  credentials: true
}));

// ============================
// Middlewares
// ============================
app.use(express.json());

// ============================
// Rutas
// ============================
app.use('/api', codeRoutes);
app.use('/api', cloudRoutes);
app.use('/api', clipRoutes);

module.exports = app;
