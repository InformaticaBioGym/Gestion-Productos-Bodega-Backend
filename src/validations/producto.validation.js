import Joi from "joi";

export const crearProductoEsquema = Joi.object({
  nombre: Joi.string().min(3).max(100).required().messages({
    "string.empty": "El nombre es obligatorio",
    "string.min": "El nombre debe tener al menos 3 caracteres",
    "string.max": "El nombre es muy largo",
  }),

  sku: Joi.string().min(3).max(50).required().messages({
    "string.empty": "El SKU es obligatorio",
    "any.required": "El SKU es obligatorio",
  }),
  codigo_barra: Joi.string().min(3).max(50).allow(null, "").optional().messages({
    "string.min": "El código de barras debe tener al menos 3 caracteres",
    "string.max": "El código de barras es muy largo",
  }),
  observaciones: Joi.string().max(100).allow(null, "").optional().messages({
    "string.max": "Las observaciones son muy largas",
  }),

});

export const editarProductoEsquema = Joi.object({
  nombre: Joi.string().min(3).max(100).optional().messages({
    "string.min": "El nombre debe tener al menos 3 caracteres",
    "string.max": "El nombre es muy largo",
  }),

  sku: Joi.string().min(3).max(50).optional().messages({
    "string.min": "El SKU debe tener al menos 3 caracteres",
    "string.max": "El SKU es muy largo",
  }),
  codigo_barra: Joi.string().min(3).max(50).allow(null, "").optional().messages({
    "string.min": "El código de barras debe tener al menos 3 caracteres",
    "string.max": "El código de barras es muy largo",
  }),
  observaciones: Joi.string().max(100).allow(null, "").optional().messages({
    "string.max": "Las observaciones son muy largas",
  }),
});
