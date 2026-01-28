export const validarEsquema = (esquema) => {
  return (req, res, next) => {
    const { error, value } = esquema.validate(req.body, {
      abortEarly: false, 
      convert: true,     
      stripUnknown: true 
    });
    if (error) {
      const mensajes = error.details.map((detalle) => detalle.message).join(", ");
      
      return res.status(400).json({ 
        mensaje: "Error de validación", 
        detalle: mensajes 
      });
    }
    req.body = value;
    next();
  };
};