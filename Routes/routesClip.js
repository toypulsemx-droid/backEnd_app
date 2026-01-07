const express = require('express')
const router = express.Router()

const { clipController } = require('../Controllers/index')

// POST → realizar pago con Clip
router.post('/user/clip/payment', clipController.pagarConClip)
router.get('/user/clip/consulta/:paymentId', clipController.consultarPago3DS);
module.exports = router
