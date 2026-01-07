const express = require('express')
const cors = require('cors');
const codeRoutes = require('./Routes/routesCode')
const cloudRoutes = require('./Routes/routeCloud')
const clipRoutes= require('./Routes/routesClip')

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

app.use('/api', codeRoutes);
app.use('/api', cloudRoutes);
app.use('/api', clipRoutes)



module.exports = app
