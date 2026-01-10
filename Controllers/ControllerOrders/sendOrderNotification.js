const User = require('../../models/modelUser');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendOrderNotification = async (pedido, correoUsuario) => {
  try {
    const {
      numeroPedido,
      nombre,
      telefono,
      total,
      cantidad,
      tipoPago,
      fechaEntrega,
      direcciones = {}
    } = pedido;

    // Extraemos correctamente envio y facturacion
    const envio = direcciones.envio || {};
    const facturacion = direcciones.facturacion || {};

    // Mensaje condicional según tipo de pago
    let mensajePago = '';
    if (tipoPago === 'spei') {
      mensajePago = 'Recibimos tu comprobante de pago SPEI. Tu pedido será procesado una vez confirmado el pago.';
    } else if (tipoPago === 'tarjeta') {
      mensajePago = 'Tu pago con tarjeta ha sido aprobado exitosamente. Tu pedido está confirmado.';
    }

    const htmlMessage = `
      <html lang="es">

<head>
    <meta charset="UTF-8" />
    <title>Confirmación de pedido</title>
    <style>
        body {
            font-family: Arial, Helvetica, sans-serif;
            background-color: #f6f6f6;
            padding: 20px;
        }

        .container {
            max-width: 600px;
            background: #ffffff;
            padding: 20px;
            margin: auto;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        h1 {
            color: #222;
            font-size: 22px;
        }

        h2 {
            margin-top: 25px;
            font-size: 18px;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
        }

        p {
            margin: 6px 0;
            color: #444;
            font-size: 14px;
        }

        .highlight {
            font-weight: bold;
            color: #000;
        }

        .status {
            background: #f0f8ff;
            padding: 10px;
            border-radius: 6px;
            margin-top: 15px;
        }
    </style>
</head>

<body>

    <div class="container">
        <h1>Recibimos tu pedido 🎉</h1>

        <p><strong>Pedido #:</strong> {{NUMERO_PEDIDO}}</p>

        <img src="https://res.cloudinary.com/dmlsys4vz/image/upload/v1767641092/nxx6s0fsth5g09rll4ho.webp" alt="Toy Pulse MX"
            style="max-width:180px; margin-bottom:15px; border: 1px solid #5050504f; border-radius: 8px; " />
            <h5 style="color: #444; text-transform: capitalize;" >adidas Collectors Edition FIFA World Cup 2026 Historical Mini Ball Set (Multi).</h5>
            <p><strong>Cantidad:</strong> {{CANTIDAD}}</p>
            <p><strong>Total:</strong> $ {{TOTAL}} MXN</p>

        
        <p><strong>Cliente:</strong> {{NOMBRE_CLIENTE}}</p>
        <p><strong>Teléfono:</strong> {{TELEFONO_CLIENTE}}</p>
        
        <p><strong>Método de pago:</strong> {{METODO_PAGO}}</p>

        <div class="status">
            <p>{{MENSAJE_PAGO}}</p>
        </div>

        <h2 style="color: #444; font-size: 14px;">Datos de envío</h2>
        <p style="color: #444; font-size: 12px;">
            {{ENVIO_CALLE}} ext: {{ENVIO_EXTERIOR}} int: {{ENVIO_INTERIOR}}<br />
            {{ENVIO_COLONIA}}, {{ENVIO_MUNICIPIO}}, {{ENVIO_ESTADO}}<br />
            CP: {{ENVIO_CP}}
        </p>
        <p>Teléfono: {{ENVIO_TELEFONO}}</p>

        <h2 style="color: #444; font-size: 14px;">Datos de facturación</h2>
        <p style="color: #444; font-size: 12px;">
            {{FACT_CALLE}} ext: {{FACT_EXTERIOR}} int: {{FACT_INTERIOR}}<br />
            {{FACT_COLONIA}}, {{FACT_MUNICIPIO}}, {{FACT_ESTADO}}<br />
            CP: {{FACT_CP}}
        </p>
        <p>Teléfono: {{FACT_TELEFONO}}</p>

        <p class="highlight">
            Fecha estimada de entrega: {{FECHA_ENTREGA}}
        </p>
        <p style="color: #6b6b6b; font-size: 12px; text-align: center; margin-top: 8px;">DISTRIBUIDORA MEXICANA TOY PULSE. ©, es responsable del tratamiento y protección de tus datos personales. 
            La información recabada se utilizará únicamente para la gestión de tus órdenes, atención a clientes y envío de información 
            relevante sobre servicios y eventos. Nuestro aviso de privacidad completo está disponible en <a href="https://toy-pulsemx.store">toy-pulsemx.store</a> <br>
            DISTRIBUIDORA MEXICANA TOY PULSE. © 2025 | Todos los derechos reservados.</p>
    </div>

</body>

</html>
    `;
    let finalHtml = htmlMessage
  .replace('{{NUMERO_PEDIDO}}', numeroPedido)
  .replace('{{NOMBRE_CLIENTE}}', nombre || correoUsuario)
  .replace('{{TELEFONO_CLIENTE}}', telefono || 'No proporcionado')
  .replace('{{TOTAL}}', total.toFixed(2))
  .replace('{{CANTIDAD}}', cantidad)
  .replace('{{METODO_PAGO}}', tipoPago.toUpperCase())
  .replace('{{MENSAJE_PAGO}}', mensajePago)

  // ENVÍO
  .replace('{{ENVIO_CALLE}}', envio?.calle || '')
  .replace('{{ENVIO_EXTERIOR}}', envio?.exterior || '')
  .replace('{{ENVIO_INTERIOR}}', envio?.interior || '')
  .replace('{{ENVIO_COLONIA}}', envio?.colonia || '')
  .replace('{{ENVIO_MUNICIPIO}}', envio?.municipio || '')
  .replace('{{ENVIO_ESTADO}}', envio?.estado || '')
  .replace('{{ENVIO_CP}}', envio?.codigoPostal || '')
  .replace('{{ENVIO_TELEFONO}}', envio?.telefono || telefono || '')

  // FACTURACIÓN
  .replace('{{FACT_CALLE}}', facturacion?.calle || '')
  .replace('{{FACT_EXTERIOR}}', facturacion?.exterior || '')
  .replace('{{FACT_INTERIOR}}', facturacion?.interior || '')
  .replace('{{FACT_COLONIA}}', facturacion?.colonia || '')
  .replace('{{FACT_MUNICIPIO}}', facturacion?.municipio || '')
  .replace('{{FACT_ESTADO}}', facturacion?.estado || '')
  .replace('{{FACT_CP}}', facturacion?.codigoPostal || '')
  .replace('{{FACT_TELEFONO}}', facturacion?.telefono || '')

  .replace('{{FECHA_ENTREGA}}', fechaEntrega);


    const msg = {
      to: correoUsuario,
      from: process.env.EMAIL_FROM,
      subject: `TOY PULSE MX NUMRERO DE PEDIDO #${numeroPedido}`,
      html: finalHtml
    };

    await sgMail.send(msg);
    // console.log('Correo de notificación enviado a', correoUsuario);

  } catch (error) {
    console.error('Error SendGrid:', error);
  }
};

module.exports = sendOrderNotification;

