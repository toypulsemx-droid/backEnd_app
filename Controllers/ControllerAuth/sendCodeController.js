const User = require('../../models/modelUser')
const nodemailer = require('nodemailer')

// Transporter de correo
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// Generar código de 6 dígitos
const generarCodigo = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

const sendCodeAuth = async (req, res) => {
  try {
    const { correo, telefono } = req.body

    if (!correo) {
      return res.status(400).json({ message: 'El correo es obligatorio' })
    }

    const codigo = generarCodigo()
    const expiracion = new Date(Date.now() + 10 * 60 * 1000) // 10 min

    let usuario = await User.findOne({ correo })

    if (!usuario) {
      usuario = new User({
        correo,
        telefono,
        codigoValidacion: codigo,
        codigoExpira: expiracion
      })
    } else {
      usuario.codigoValidacion = codigo
      usuario.codigoExpira = expiracion
    }

    await usuario.save()

    // 📧 Enviar correo
    await transporter.sendMail({
      from: `"Validación" <${process.env.EMAIL_USER}>`,
      to: correo,
      subject: 'Tu código de verificación',
      html: `
        <h1>TOY PULSE</h1>
        <h2>Código de verificación</h2>
        <p>Tu código es:</p>
        <h1>${codigo}</h1>
        <p>Este código expira en 10 minutos.</p>
      `
    })

    return res.json({
      message: 'Código enviado al correo'
    })

  } catch (error) {
    console.error('Error al enviar código:', error)
    return res.status(500).json({ message: 'Error del servidor' })
  }
}

module.exports = sendCodeAuth
