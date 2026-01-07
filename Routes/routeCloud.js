const express = require('express')
const router = express.Router()
const upload = require('../middlewares/upload')
const { cloudController } = require('../Controllers/index')

// upload.any() permite recibir cualquier archivo, sin importar el name
router.post(
  '/user/upload/spei',
  upload.any(),
  cloudController.cloudDinary
)

module.exports = router
