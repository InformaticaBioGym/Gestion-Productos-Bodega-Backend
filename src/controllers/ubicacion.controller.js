import * as ubicacionService from "../services/ubicacion.service.js";
import { subirImagen, eliminarImagen } from "../utils/cloudinary.utils.js";
import fs from "fs-extra";

export const crearUbicacion = async (req, res) => {
  let fotoUrl = null;

  try {
    if (!req.file) {
      return res.status(400).json({ mensaje: "La foto de la ubicación es obligatoria." });
    }
    const producto_id = parseInt(req.body.producto_id);
    const bodega_id = parseInt(req.body.bodega_id);
    const estante = req.body.estante ? parseInt(req.body.estante) : null;
    const descripcion = req.body.descripcion;
    await ubicacionService.validarUbicacionAntesDeCriar(
      producto_id,
      bodega_id,
      estante,
    );

    fotoUrl = await subirImagen(req.file.path);
    if (await fs.pathExists(req.file.path)) {
      await fs.unlink(req.file.path);
    }

    const datos = {
      producto_id,
      bodega_id,
      estante,
      descripcion,
      foto: fotoUrl,
    };
    const ubicacion = await ubicacionService.crearUbicacionService(datos);
    res.status(201).json({ mensaje: "Ubicación registrada", ubicacion });
  } catch (error) {
    console.error("Error creando ubicación:", error);
    if (fotoUrl) {
      await eliminarImagen(fotoUrl);
    }
    if (req.file && (await fs.pathExists(req.file.path))) {
      await fs.unlink(req.file.path);
    }
    if (error.message === "UBICACION_DUPLICADA")
      return res
        .status(400)
        .json({ mensaje: "El producto ya existe en esa ubicación." });
    if (error.message === "PRODUCTO_NO_ENCONTRADO")
      return res.status(404).json({ mensaje: "El producto no existe" });
    if (error.message === "BODEGA_NO_ENCONTRADA")
      return res.status(404).json({ mensaje: "La bodega no existe" });
    if (error.message === "ESTANTE_INVALIDO")
      return res
        .status(400)
        .json({ mensaje: "El estante excede el límite de la bodega" });
    res.status(500).json({ mensaje: "Error interno" });
  }
};

export const obtenerUbicaciones = async (req, res) => {
  try {
    const { busqueda } = req.query;
    const ubicaciones =
      await ubicacionService.obtenerUbicacionesService(busqueda);

    if (busqueda && ubicaciones.length === 0) {
      return res
        .status(404)
        .json({ mensaje: "No se encontraron ubicaciones para ese producto" });
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
};

export const editarUbicacion = async (req, res) => {
  let newFotoUrl = null;
  try {
    const { id } = req.params;
    const ubicacionActual =
      await ubicacionService.obtenerUbicacionPorIdService(id);
    let datosActualizacion = { ...req.body };
    if (
      req.body.estante === "" ||
      req.body.estante === undefined ||
      req.body.estante === "null"
    ) {
      datosActualizacion.estante = null;
    } else {
      datosActualizacion.estante = parseInt(req.body.estante);
    }

    if (req.file) {
      newFotoUrl = await subirImagen(req.file.path);
      datosActualizacion.foto = newFotoUrl;

      if (await fs.pathExists(req.file.path)) {
        await fs.unlink(req.file.path);
      }
    }

    const ubicacion = await ubicacionService.editarUbicacionService(
      id,
      datosActualizacion,
    );
    if (req.file && ubicacionActual.foto) {
      await eliminarImagen(ubicacionActual.foto);
    }
    res.json({ mensaje: "Ubicación actualizada", ubicacion });
  } catch (error) {
    console.error("Error en editar:", error);
    if (newFotoUrl) {
      await eliminarImagen(newFotoUrl);
    }
    if (error.message === "UBICACION_NO_ENCONTRADA")
      return res.status(404).json({ mensaje: "Ubicación no encontrada" });
    if (error.message === "ESTANTE_INVALIDO")
      return res
        .status(400)
        .json({ mensaje: "El estante no es válido para esta bodega" });
    if (error.message === "UBICACION_DUPLICADA")
      return res.status(400).json({
        mensaje: "El producto ya existe en esa ubicación de destino.",
      });

    res.status(500).json({ mensaje: "Error interno" });
  }
};

export const eliminarUbicacion = async (req, res) => {
  try {
    const { id } = req.params;
    await ubicacionService.eliminarUbicacionService(id);
    res.json({ mensaje: "Ubicación eliminada" });
  } catch (error) {
    if (error.message === "UBICACION_NO_ENCONTRADA")
      return res.status(404).json({ mensaje: "Ubicación no encontrada" });
    console.error(error);
    res.status(500).json({ mensaje: "Error interno" });
  }
};
