const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "No se proporcionó el token. Acceso no autorizado" });
  }

  // Verificar que el token tiene el formato "Bearer <token>"
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: "Formato de token inválido. Debe ser 'Bearer <token>'" });
  }

  const token = parts[1];

  try {
    // Verificar el token y extraer el userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;  // Guardar el userId en la solicitud
    next();  // Pasa al siguiente middleware o ruta
  } catch (err) {
    // En caso de error con el token (por ejemplo, si ha expirado)
    res.status(401).json({ error: "Token inválido o expirado" });
  }
};
