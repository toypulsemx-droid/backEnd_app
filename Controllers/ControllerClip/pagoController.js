

const pagarConClip = async (req, res) => {
  try {
    const {
      cardToken,
      amount,
      description,
      email,
      phone,
      simulate3DS // ⚡ opcional para sandbox
    } = req.body;

    if (!cardToken || !amount) {
      return res.status(400).json({
        ok: false,
        message: 'cardToken y amount son obligatorios'
      });
    }

    const bodyData = {
      amount: Number(amount),
      currency: 'MXN',
      description: description || 'Pago',
      payment_method: {
        token: cardToken
      },
      customer: {
        email,
        phone
      }
    };

    if (simulate3DS) {
      bodyData.simulate_3ds = true; // ⚡ fuerza 3DS en sandbox
    }

    const response = await fetch(process.env.CLIP_URI, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.KEY_CLIP}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyData)
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        ok: false,
        error: data
      });
    }

    return res.json({
      ok: true,
      payment: data
    });

  } catch (error) {
    console.error('Error en pago Clip:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = pagarConClip;
