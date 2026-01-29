import * as ubicacionService from "../services/ubicacion.service.js";
import { subirImagen, eliminarImagen } from "../utils/cloudinary.utils.js";

export const crearUbicacion = async (req, res) => {
  let fotoUrl = null;
  let filePath = null;

  try {
    const producto_id = parseInt(req.body.producto_id);
    const bodega_id = parseInt(req.body.bodega_id);
    const estante = parseInt(req.body.estante);
    await ubicacionService.validarUbicacionAntesDeCriar(producto_id, bodega_id, estante);

    if (req.file) {
      filePath = req.file.path;
      fotoUrl = await subirImagen(filePath);
    }

    const datos = {
        producto_id,
        bodega_id,
        estante,
        foto: fotoUrl 
    };
    const ubicacion = await ubicacionService.crearUbicacionService(datos);
    res.status(201).json({ mensaje: "Ubicación registrada", ubicacion });
  } catch (error) {
    if (error.message === "UBICACION_DUPLICADA" && req.file && fotoUrl) {
      await eliminarImagen(fotoUrl);
    }
    if (error.message === "PRODUCTO_NO_ENCONTRADO") 
        return res.status(404).json({ mensaje: "El producto no existe" });
    if (error.message === "BODEGA_NO_ENCONTRADA") 
        return res.status(404).json({ mensaje: "La bodega no existe" });
    if (error.message === "ESTANTE_INVALIDO") 
        return res.status(400).json({ mensaje: "El número de estante excede el límite de la bodega" });
    if (error.message === "UBICACION_DUPLICADA")
        return res.status(400).json({ mensaje: "Este producto ya se encuentra ubicado en ese estante y bodega." });
    res.status(500).json({ mensaje: "Error interno" });
  }
};

export const obtenerUbicaciones = async (req, res) => {
  try {
    const { busqueda } = req.query; 
    const ubicaciones = await ubicacionService.obtenerUbicacionesService(busqueda);
    
    if (busqueda && ubicaciones.length === 0) {
        return res.status(404).json({ mensaje: "No se encontraron ubicaciones para ese producto" });
    }

    res.json(ubicaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener ubicaciones" });
  }
};

export const obtenerUbicacion = async (req, res) => {
    try {
        const { id } = req.params;
        const ubicacion = await ubicacionService.obtenerUbicacionPorIdService(id);
        res.json(ubicacion);
    } catch (error) {
        if (error.message === "UBICACION_NO_ENCONTRADA") 
            return res.status(404).json({ mensaje: "Ubicación no encontrada" });
        res.status(500).json({ mensaje: "Error interno" });
    }
}

export const editarUbicacion = async (req, res) => {
  try {
    const { id } = req.params;
    const ubicacionActual = await ubicacionService.obtenerUbicacionPorIdService(id);
    let datosActualizacion = { ...req.body };

    if (req.file) {
      if (ubicacionActual.foto) {
        await eliminarImagen(ubicacionActual.foto);
      }
      datosActualizacion.foto = await subirImagen(req.file.path);
    }

    const ubicacion = await ubicacionService.editarUbicacionService(id, datosActualizacion);
    res.json({ mensaje: "Ubicación actualizada", ubicacion });
  } catch (error) {
    if (error.message === "UBICACION_NO_ENCONTRADA") 
        return res.status(404).json({ mensaje: "Ubicación no encontrada" });
    if (error.message === "ESTANTE_INVALIDO") 
        return res.status(400).json({ mensaje: "El estante no es válido para esta bodega" });
    if (error.message === "UBICACION_DUPLICADA") 
        return res.status(400).json({ mensaje: "El producto ya existe en esa ubicación de destino." });
    res.status(500).json({ mensaje: "Error interno" });
  }
};

export const eliminarUbicacion = async (req, res) => {
  try {
    const { id } = req.params;
    const ubicacion = await ubicacionService.obtenerUbicacionPorIdService(id);
    if (ubicacion.foto) {
      await eliminarImagen(ubicacion.foto);
    }
    await ubicacionService.eliminarUbicacionService(id);
    res.json({ mensaje: "Ubicación eliminada" });
  } catch (error) {
    if (error.message === "UBICACION_NO_ENCONTRADA") 
      return res.status(404).json({ mensaje: "Ubicación no encontrada" });
    res.status(500).json({ mensaje: "Error interno" });
  }
};