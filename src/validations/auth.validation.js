import Joi from "joi";

export const registroEsquema = Joi.object({
  rut: Joi.string().min(8).max(9).required().messages({
    "string.empty": "El RUT no puede estar vacío",
    "string.min": "El RUT es muy corto",
    "string.max": "El RUT es muy largo",
    "any.required": "El RUT es un campo obligatorio"
  }),
  
  nombre: Joi.string().min(3).max(100).required().messages({
    "string.min": "El nombre debe tener al menos 3 caracteres",
    "string.max": "El nombre no puede superar los 100 caracteres",
    "any.required": "El nombre es obligatorio"
  }),

  contraseña: Joi.string().min(6).required().messages({
    "string.min": "La contraseña debe tener al menos 6 caracteres",
    "string.max": "La contraseña no puede superar los 72 caracteres",
    "any.required": "La contraseña es obligatoria"
  }),

  rol: Joi.string().valid("administrador", "trabajador").optional().messages({
    "any.only": "El rol debe ser 'administrador' o 'trabajador'"
  })
});