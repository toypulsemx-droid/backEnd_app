const express = require('express');
const cors = require('cors');

const codeRoutes = require('./Routes/routesCode');
const cloudRoutes = require('./Routes/routeCloud');
const clipRoutes = require('./Routes/routesClip');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://tu-frontend-en-render.com'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // Postman o fetch sin origin
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS no permitido'));
  },
  credentials: true,
  methods: ['GET','POST','PUT','DELETE'],
}));

app.use(express.json());

// Rutas
app.use('/api', codeRoutes);
app.use('/api', cloudRoutes);
app.use('/api', clipRoutes);

module.exports = app;
