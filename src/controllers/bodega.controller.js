import * as bodegaService from "../services/bodega.service.js";

export const crearBodega = async (req, res) => {
  try {
    const bodega = await bodegaService.crearBodegaService(req.body);
    res.status(201).json({ mensaje: "Bodega creada", bodega });
  } catch (error) {
    res.status(500).json({ mensaje: "Error interno" });
  }
};

export const obtenerBodegas = async (req, res) => {
  try {
    const bodegas = await bodegaService.obtenerBodegasService();
    res.json(bodegas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener bodegas" });
  }
};

export const obtenerBodega = async (req, res) => {
  try {
    const { id } = req.params;
    const bodega = await bodegaService.obtenerBodegaPorIdService(id);
    res.json(bodega);
  } catch (error) {
    if (error.message === "BODEGA_NO_ENCONTRADO")
      return res.status(404).json({ mensaje: "Bodega no encontrada" });
    res.status(500).json({ mensaje: "Error interno" });
  }
};

export const editarBodega = async (req, res) => {
  try {
    const { id } = req.params;
    const bodega = await bodegaService.editarBodegaService(id, req.body);
    res.json({ mensaje: "Bodega actualizada", bodega });
  } catch (error) {
    if (error.message === "BODEGA_NO_ENCONTRADA")
      return res.status(404).json({ mensaje: "Bodega no encontrada" });
    res.status(500).json({ mensaje: "Error interno" });
  }
};

export const eliminarBodega = async (req, res) => {
  try {
    const { id } = req.params;
    await bodegaService.eliminarBodegaService(id);
    res.json({ mensaje: "Bodega eliminada correctamente" });
  } catch (error) {
    if (error.message === "BODEGA_NO_ENCONTRADA")
      return res.status(404).json({ mensaje: "Bodega no encontrada" });
    res.status(500).json({ mensaje: "Error interno" });
  }
};
