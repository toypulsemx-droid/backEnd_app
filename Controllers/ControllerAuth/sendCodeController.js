const User = require('../../models/modelUser')
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// Generar código
const generarCodigo = () =>
  Math.floor(100000 + Math.random() * 900000).toString()

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
        codigoExpira: expiracion
      })
    } else {
      usuario.codigoValidacion = codigo
      usuario.codigoExpira = expiracion
    }

    await usuario.save()

    // 📧 Enviar correo con SendGrid API
    await sgMail.send({
      to: correo,
      from: process.env.EMAIL_FROM,
      subject: 'Tu código de verificación',
      html: `
        <h1>TOY PULSE</h1>
        <p>Tu código de verificación es:</p>
        <h1>${codigo}</h1>
        <p>Expira en 10 minutos</p>
      `
    })

    res.json({ message: 'Código enviado correctamente' })

  } catch (error) {
    console.error('Error al enviar código:', error)
    res.status(500).json({ message: 'Error del servidor' })
  }
}

module.exports = sendCodeAuth
