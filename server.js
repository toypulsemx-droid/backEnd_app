require('dotenv').config()
const app = require('./app')
const connectDB = require('./Config/connectDB')


const PORT = process.env.PORT || 5000


// Conectar a MongoDB
connectDB()

// Levantar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto: ${PORT}`)
})