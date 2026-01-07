const express = require('express')
const router = express.Router()
const {codeUserController} = require('../Controllers/index')


router.post('/user/send-code', codeUserController.sendCode )
router.post('/user/verificar-code' ,codeUserController.verificarCode)


module.exports = router