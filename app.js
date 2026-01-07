const express = require('express')
const cors = require('cors');
const codeRoutes = require('./Routes/routesCode')
const cloudRoutes = require('./Routes/routeCloud')
const clipRoutes = require('./Routes/routesClip')

const app = express()

// Configuración CORS correcta
app.use(cors({
  origin: 'http://localhost:5173', // reemplaza con tu frontend en producción cuando subas
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}))

// Middlewares
app.use(express.json())

// Rutas
app.use('/api', codeRoutes);
app.use('/api', cloudRoutes);
app.use('/api', clipRoutes)

module.exports = app
