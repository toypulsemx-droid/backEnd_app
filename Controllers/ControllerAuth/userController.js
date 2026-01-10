const User = require('../../models/modelUser');

/**
 * Obtener toda la información del usuario logueado
 * Se asume que req.user.id viene del middleware de autenticación JWT
 */
const getUserProfile = async (req, res) => {
  try {
    // Verificar que el middleware de autenticación haya agregado el id
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    // Buscar usuario por id y traer todos los pedidos y campos
    const user = await User.findById(userId).lean(); // lean() devuelve un objeto JS plano

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Retornar usuario completo (puedes excluir campos sensibles si quieres)
    // Por ejemplo, password o tokens
    const { password, codigoValidacion, ...userData } = user;

    return res.status(200).json({
      message: 'Perfil del usuario',
      user: userData
    });

  } catch (error) {
    console.error('Error al obtener perfil de usuario:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = getUserProfile;
