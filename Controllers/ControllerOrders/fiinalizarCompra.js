const User = require('../../models/modelUser');
const sendOrderNotification = require('./sendOrderNotification');

const finalizarCompra = async (req, res) => {
  try {
    // console.log('BODY:', req.body)
    // console.log('USER:', req.user)

    const {
      numeroPedido,
      nombre,
      telefono,
      cantidad,          // 👈 IMPORTANTE
      total,
      tipoPago,
      fechaEntrega,
      status,
      direcciones
    } = req.body

    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    // 🔹 Crear objeto pedido antes de empujarlo
    const nuevoPedido = {
      numeroPedido: String(numeroPedido),
      nombre,
      telefono,
      cantidad,          // ✅ AHORA SÍ
      total,
      tipoPago,
      fechaEntrega,
      status,
      direcciones
    }

    // Agregar al array de pedidos
    user.pedidos.push(nuevoPedido)

    if (!user.telefono) {
      user.telefono = telefono
    }

    await user.save()

    // Enviar correo de notificación
    await sendOrderNotification(nuevoPedido, user.correo);

    return res.status(201).json({
      message: 'Pedido guardado correctamente'
    })
  } catch (error) {
    console.error('ERROR FINALIZAR COMPRA:', error)
    return res.status(500).json({ message: 'Error interno del servidor' })
  }
}

module.exports = finalizarCompra
