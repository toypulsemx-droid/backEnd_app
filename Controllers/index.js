const codeUserController = require('./ControllerAuth/index');
const cloudController = require('./ControllerSpei/index')
const clipController = require('./ControllerClip/index')
const finalizarCompraController = require('./ControllerOrders/index')

module.exports = {cloudController, codeUserController, clipController , finalizarCompraController};