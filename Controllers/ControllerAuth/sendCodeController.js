const User = require('../../models/modelUser');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Generar código
const generarCodigo = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const sendCodeAuth = async (req, res) => {
  try {
    const { correo, telefono } = req.body;

    if (!correo) {
      return res.status(400).json({ message: 'El correo es obligatorio' });
    }

    const codigo = generarCodigo();
    const expiracion = new Date(Date.now() + 10 * 60 * 1000);

    let usuario = await User.findOne({ correo });

    if (!usuario) {
      usuario = new User({
        correo,
        telefono,
        codigoValidacion: codigo,
        codigoExpira: expiracion
      });
    } else {
      usuario.codigoValidacion = codigo;
      usuario.codigoExpira = expiracion;
    }

    await usuario.save();

    const msg = {
      to: correo,
      from: process.env.EMAIL_FROM,
      subject: 'Tu código de verificación',
      html: `
        <h1>TOY PULSE</h1>
        <p>Tu código es:</p>
        <h2>${codigo}</h2>
        <p>Expira en 10 minutos</p>
      `
    };

    await sgMail.send(msg);

    res.json({ message: 'Código enviado al correo' });

  } catch (error) {
    console.error('Error SendGrid:', error);
    res.status(500).json({ message: 'Error al enviar correo' });
  }
};

module.exports = sendCodeAuth;
