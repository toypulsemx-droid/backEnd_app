const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    // Identificador principal
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

    // Código de validación (6 dígitos)
    codigoValidacion: {
      type: String,
      length: 6
    },

    // Expira en 10 minutos (se calculará al asignar)
    codigoExpira: {
      type: Date
    },

    // Folios de órdenes
    ordenes: [
      {
        type: String
      }
    ],

    // Máximo 2 direcciones
    direcciones: {
      type: [
        {
          calle: String,
          ciudad: String,
          estado: String,
          codigoPostal: String
        }
      ],
      validate: {
        validator: function (v) {
          return v.length <= 2
        }
      }
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('User', userSchema)
