const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    // 🔐 NO TOCAR (login)
    correo: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    telefono: {
      type: String,
      trim: true
    },

    codigoValidacion: {
      type: String,
      length: 6
    },

    codigoExpira: {
      type: Date
    },

  
    pedidos: [
      {
        numeroPedido: {
          type: String,
          required: true
        },

        nombre: {
          type: String,
          required: true
        },

        telefono: {
          type: String,
          required: true
        },

        cantidad: {
          type: Number,
          required: true
        },
          status: {
          type: String,
           required: true,
           
        },


        total: {
          type: Number,
          required: true
        },

        tipoPago: {
          type: String,
          required: true
        },

        fechaEntrega: {
          type: String
        },

        direcciones: {
          envio: {
            calle: String,
            exterior: String,
            interior: String,
            colonia:String,
            codigoPostal: String,
            municipio: String,            
            estado: String
          },
          facturacion: {
            calle: String,
            exterior: String,
            interior: String,
            colonia:String,
            codigoPostal: String,
            municipio: String,            
            estado: String
          }
        },

      
        fechaCompra: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('User', userSchema)
