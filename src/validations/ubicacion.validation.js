import Joi from "joi";

export const crearUbicacionEsquema = Joi.object({
  producto_id: Joi.number().integer().required().messages({
    "number.base": "El ID del producto debe ser un número",
    "any.required": "El ID del producto es obligatorio",
    "string.empty": "El ID del producto no puede estar vacío",
  }),
  bodega_id: Joi.number().integer().required().messages({
    "number.base": "El ID de la bodega debe ser un número",
    "any.required": "El ID de la bodega es obligatorio",
    "string.empty": "El ID de la bodega no puede estar vacío",
  }),
  estante: Joi.number().integer().min(1).allow(null).optional().messages({
    "number.base": "El número de estante debe ser un número",
    "number.integer": "El número de estante debe ser un número entero",
    "number.min": "El número de estante debe ser mayor a 0",
  }),
  descripcion: Joi.string().max(100).allow(null, "").optional().messages({
    "string.base": "La descripción debe ser texto",
    "string.max": "La descripción no puede superar 100 caracteres",
  }),
  foto: Joi.string().allow(null, "").messages({
    "string.base": "La foto debe ser una cadena (url o nombre de archivo)",
  }),
});

export const editarUbicacionEsquema = Joi.object({
  bodega_id: Joi.number().integer().optional().messages({
    "number.base": "El ID de la bodega debe ser un número",
    "number.integer": "El ID de la bodega debe ser un número entero",
  }),
  estante: Joi.number().integer().min(1).allow(null).optional().messages({
    "number.base": "El número de estante debe ser un número",
    "number.integer": "El número de estante debe ser un número entero",
    "number.min": "El número de estante debe ser mayor a 0",
  }),
  descripcion: Joi.string().max(100).allow(null, "").optional().messages({
    "string.base": "La descripción debe ser texto",
    "string.max": "La descripción no puede superar 100 caracteres",
  }),
  foto: Joi.string().allow(null, "").optional().messages({
    "string.base": "La foto debe ser una cadena (url o nombre de archivo)",
  }),
});
