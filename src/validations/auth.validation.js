import Joi from "joi";

export const registroEsquema = Joi.object({
  correo: Joi.string().min(8).max(100).email().required().messages({
    "string.empty": "El correo no puede estar vacío",
    "string.min": "El correo es muy corto",
    "string.max": "El correo es muy largo",
    "any.required": "El correo es un campo obligatorio",
    "string.email": "El correo debe ser una dirección de correo válida"
  }),
  
  nombre: Joi.string().min(3).max(100).required().messages({
    "string.empty": "El nombre no puede estar vacío",
    "string.min": "El nombre debe tener al menos 3 caracteres",
    "string.max": "El nombre no puede superar los 100 caracteres",
    "any.required": "El nombre es obligatorio"
  }),

  contraseña: Joi.string().min(6).required().messages({
    "string.min": "La contraseña debe tener al menos 6 caracteres",
    "string.max": "La contraseña no puede superar los 72 caracteres",
    "string.empty": "La contraseña no puede estar vacía",
    "any.required": "La contraseña es obligatoria"
  }),

  rol: Joi.string().valid("administrador", "trabajador").optional().messages({
    "any.only": "El rol debe ser 'administrador' o 'trabajador'"
  })
});