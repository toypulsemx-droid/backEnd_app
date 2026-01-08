const User = require('../../models/modelUser')
const nodemailer = require('nodemailer')

// ✅ Transporter SendGrid
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  secure: false,
  auth: {
    user: 'apikey',
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 20000,
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
    const expiracion = new Date(Date.now() + 10 * 60 * 1000)

    let usuario = await User.findOne({ correo })

    if (!usuario) {
      usuario = new User({
        correo,
        telefono,
        codigoValidacion: codigo,
        codigoExpira: expiracion,
      })
    } else {
      usuario.codigoValidacion = codigo
      usuario.codigoExpira = expiracion
    }

    await usuario.save()

    // 📧 Envío con SendGrid
    await transporter.sendMail({
      from: `"Toy Pulse" <${process.env.EMAIL_FROM}>`,
      to: correo,
      subject: 'Tu código de verificación',
      html: `
        <div style="font-family: Arial; text-align:center;">
          <h1>TOY PULSE</h1>
          <h2>Código de verificación</h2>
          <h1 style="letter-spacing:5px;">${codigo}</h1>
          <p>Este código expira en 10 minutos.</p>
        </div>
      `,
    })

    return res.json({ message: 'Código enviado al correo' })

  } catch (error) {
    console.error('Error al enviar código:', error)
    return res.status(500).json({ message: 'Error del servidor' })
  }
}

module.exports = sendCodeAuth
