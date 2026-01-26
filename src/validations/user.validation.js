import Joi from "joi";

export const editarUsuarioEsquema = Joi.object({
  nombre: Joi.string().min(3).max(100).optional().messages({
    "string.min": "El nombre debe tener al menos 3 caracteres",
    "string.max": "El nombre no puede superar los 100 caracteres"
  }),

  rol: Joi.string().valid("administrador", "trabajador").optional().messages({
    "any.only": "El rol solo puede ser 'administrador' o 'trabajador'"
  }),

  rut: Joi.string().min(8).max(9).optional().messages({
    "string.min": "El RUT es muy corto (mínimo 8 caracteres)",
    "string.max": "El RUT es muy largo (máximo 9 caracteres)"
  }),

  contraseña: Joi.string().min(6).max(72).optional().messages({
    "string.min": "La contraseña nueva debe tener al menos 6 caracteres",
    "string.max": "La contraseña no puede superar los 72 caracteres"
  })
});