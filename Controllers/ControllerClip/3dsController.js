// si usas Node 18+, puedes usar fetch nativo

const consultarPago3DS = async (req, res) => {
  try {
    const { paymentId } = req.params;

    if (!paymentId) {
      return res.status(400).json({ ok: false, message: 'paymentId es obligatorio' });
    }

    const CLIP_API_KEY = process.env.KEY_CLIP; // tu API Key desde .env

    // ✅ Puedes agregar un query param simulate3DS para pruebas, opcional
    const url = `${process.env.CLIP_URI}/${paymentId}?simulate3DS=true`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CLIP_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ ok: false, error: data });
    }

    return res.json({ ok: true, payment: data });
  } catch (error) {
    console.error('Error consultando pago 3DS:', error);
    return res.status(500).json({ ok: false, message: 'Error interno del servidor' });
  }
};

module.exports = consultarPago3DS;
