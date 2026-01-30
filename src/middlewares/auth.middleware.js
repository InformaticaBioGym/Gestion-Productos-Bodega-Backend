import jwt from "jsonwebtoken";

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ mensaje: "Acceso denegado. No hay token." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodificado = jwt.verify(token, process.env.JWT_SECRET);

    req.usuario = decodificado;

    next();
  } catch (error) {
    return res.status(403).json({ mensaje: "Token inválido o expirado." });
  }
};

export const esAdministrador = (req, res, next) => {
  if (req.usuario.rol !== "administrador") {
    return res
      .status(403)
      .json({ mensaje: "Acceso denegado. Se requiere rol de administrador." });
  }
  next();
};
