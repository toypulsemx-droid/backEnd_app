const User = require('../../models/modelUser')
const jwt = require('jsonwebtoken')

const verificarCodigo = async (req, res) => {
  try {
    const { correo, codigo } = req.body

    if (!correo || !codigo) {
      return res.status(400).json({
        message: 'Correo y código son obligatorios'
      })
    }

    const user = await User.findOne({ correo })

    if (!user) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      })
    }

    // Revisar si hay código activo
    if (!user.codigoValidacion || !user.codigoExpira) {
      return res.status(400).json({
        message: 'No hay código activo para este usuario'
      })
    }

    // Comparar código
    if (user.codigoValidacion !== codigo) {
      return res.status(400).json({
        message: 'Código incorrecto'
      })
    }

    // Verificar expiración
    if (user.codigoExpira < new Date()) {
      return res.status(400).json({
        message: 'El código ha expirado'
      })
    }

    // ✅ Código válido → limpiar campos
    user.codigoValidacion = undefined
    user.codigoExpira = undefined
    await user.save()

    // 🔐 CREAR JWT (AQUÍ ES)
    const token = jwt.sign(
      {
        id: user._id,
        correo: user.correo
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    // 🔁 Respuesta al frontend
    res.json({
      message: 'Código verificado correctamente',
      token,
      user: {
        id: user._id,
        correo: user.correo
      }
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Error al verificar el código'
    })
  }
}

module.exports = verificarCodigo
