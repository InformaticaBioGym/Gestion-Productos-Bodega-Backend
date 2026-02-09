import fs from "fs-extra";

export const validarEsquema = (esquema) => {
  return async (req, res, next) => {
    const { error, value } = esquema.validate(req.body, {
      abortEarly: false,
      convert: true,
      stripUnknown: true,
    });
    if (error) {
      if (req.file) {
        try {
          if (await fs.pathExists(req.file.path)) {
            await fs.unlink(req.file.path);
          }
        } catch (err) {
          console.error("Error al intentar borrar archivo temporal:", err);
        }
      }
      const mensajes = error.details
        .map((detalle) => detalle.message)
        .join(", ");

      return res.status(400).json({
        mensaje: "Error de validación",
        detalle: mensajes,
      });
    }
    req.body = value;
    next();
  };
};
