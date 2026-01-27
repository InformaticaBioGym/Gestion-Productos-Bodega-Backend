import Joi from "joi";

export const crearBodegaEsquema = Joi.object({
  nombre: Joi.string().min(3).max(100).required().messages({
    "string.empty": "El nombre es obligatorio",
    "string.min": "El nombre debe tener al menos 3 caracteres",
    "any.required": "El nombre es obligatorio"
  }),
  
  ubicacion_fisica: Joi.string().min(3).max(200).required().messages({
    "string.min": "La ubicación física debe tener al menos 3 caracteres",
    "string.max": "La ubicación física es muy larga (máximo 200 caracteres)",
    "string.empty": "La ubicación física es obligatoria",
    "any.required": "La ubicación física es obligatoria"
  }),

  n_estantes: Joi.number().integer().min(1).required().messages({
    "number.base": "El número de estantes debe ser un número",
    "number.min": "La bodega debe tener al menos 1 estante",
    "any.required": "El número de estantes es obligatorio"
  })
});

export const editarBodegaEsquema = Joi.object({
  nombre: Joi.string().min(3).max(100).optional().messages({
    "string.min": "El nombre debe tener al menos 3 caracteres",
    "string.max": "El nombre no puede superar los 100 caracteres"
  }),

  ubicacion_fisica: Joi.string().min(3).max(200).optional().messages({
    "string.min": "La ubicación física debe tener al menos 3 caracteres",
    "string.max": "La ubicación física es muy larga (máximo 200 caracteres)"
  }),

  n_estantes: Joi.number().integer().min(1).optional().messages({
    "number.base": "El número de estantes debe ser un número",
    "number.integer": "El número de estantes debe ser un número entero",
    "number.min": "La bodega debe tener al menos 1 estante"
  })
});