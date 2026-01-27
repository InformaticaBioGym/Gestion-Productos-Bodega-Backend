import * as productService from "../services/product.service.js";

export const crearProducto = async (req, res) => {
  try {
    const producto = await productService.crearProductoService(req.body);
    res.status(201).json({ mensaje: "Producto creado", producto });
  } catch (error) {
    if (error.message === "SKU_DUPLICADO") return res.status(400).json({ mensaje: "El SKU ya existe" });
    res.status(500).json({ mensaje: "Error interno" });
  }
};

export const obtenerProductos = async (req, res) => {
  try {
    const productos = await productService.obtenerProductosService();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener productos" });
  }
};

export const obtenerProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await productService.obtenerProductoPorIdService(id);
    res.json(producto);
  } catch (error) {
    if (error.message === "PRODUCTO_NO_ENCONTRADO") return res.status(404).json({ mensaje: "Producto no encontrado" });
    res.status(500).json({ mensaje: "Error interno" });
  }
};

export const editarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await productService.editarProductoService(id, req.body);
    res.json({ mensaje: "Producto actualizado", producto });
  } catch (error) {
    if (error.message === "PRODUCTO_NO_ENCONTRADO") return res.status(404).json({ mensaje: "Producto no encontrado" });
    if (error.message === "SKU_DUPLICADO") return res.status(400).json({ mensaje: "El SKU ya existe" });
    res.status(500).json({ mensaje: "Error interno" });
  }
};

export const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    await productService.eliminarProductoService(id);
    res.json({ mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    if (error.message === "PRODUCTO_NO_ENCONTRADO") return res.status(404).json({ mensaje: "Producto no encontrado" });
    res.status(500).json({ mensaje: "Error interno" });
  }
};