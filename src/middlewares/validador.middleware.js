export const validarEsquema = (esquema) => {
  return (req, res, next) => {
    const { error } = esquema.validate(req.body);

    if (error) {
      return res.status(400).json({ 
        mensaje: "Error de validación", 
        detalle: error.details[0].message 
      });
    }

    next();
  };
};