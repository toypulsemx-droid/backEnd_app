const express = require('express')
const router = express.Router()
const {finalizarCompraController ,codeUserController} = require('../Controllers/index')

const authMiddleware = require('../middlewares/authMiddleware')


router.post('/user/order/finish', authMiddleware, finalizarCompraController.finalizarCompra )
router.get('/user/profile/all', authMiddleware, codeUserController.getUserProfile);



module.exports = router