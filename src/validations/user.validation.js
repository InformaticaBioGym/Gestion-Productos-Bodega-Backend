import Joi from "joi";

export const editarUsuarioEsquema = Joi.object({
  nombre: Joi.string().min(3).max(100).optional().messages({
    "string.min": "El nombre debe tener al menos 3 caracteres",
    "string.max": "El nombre no puede superar los 100 caracteres"
  }),

  rol: Joi.string().valid("administrador", "trabajador").optional().messages({
    "any.only": "El rol solo puede ser 'administrador' o 'trabajador'"
  }),

  correo: Joi.string().min(8).max(100).email().optional().messages({
    "string.min": "El correo es muy corto",
    "string.max": "El correo es muy largo",
    "string.email": "El correo debe ser una dirección de correo válida"
  }),

  contraseña: Joi.string().min(6).max(72).optional().messages({
    "string.min": "La contraseña nueva debe tener al menos 6 caracteres",
    "string.max": "La contraseña no puede superar los 72 caracteres"
  })
});