import * as productoService from "../services/producto.service.js";

export const crearProducto = async (req, res) => {
  try {
    const producto = await productoService.crearProductoService(req.body);
    res.status(201).json({ mensaje: "Producto creado", producto });
  } catch (error) {
    if (error.message === "SKU_DUPLICADO")
      return res.status(400).json({ mensaje: "El SKU ya existe" });
    if (error.message === "CODIGO_BARRA_DUPLICADO")
      return res.status(400).json({ mensaje: "El código de barras ya existe" });
    res.status(500).json({ mensaje: "Error interno" });
  }
};

export const obtenerProductos = async (req, res) => {
  try {
    const { busqueda } = req.query;
    const productos = await productoService.obtenerProductosService(busqueda);

    if (busqueda && productos.length === 0) {
      return res
        .status(404)
        .json({ mensaje: "No se encontraron productos con ese criterio" });
    }

    res.json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener productos" });
  }
};

export const obtenerProductoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await productoService.obtenerProductoPorIdService(id);
    res.json(producto);
  } catch (error) {
    if (error.message === "PRODUCTO_NO_ENCONTRADO")
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    res.status(500).json({ mensaje: "Error interno" });
  }
};

export const editarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await productoService.editarProductoService(id, req.body);
    res.json({ mensaje: "Producto actualizado", producto });
  } catch (error) {
    if (error.message === "PRODUCTO_NO_ENCONTRADO")
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    if (error.message === "SKU_DUPLICADO")
      return res.status(400).json({ mensaje: "El SKU ya existe" });
    res.status(500).json({ mensaje: "Error interno" });
  }
};

export const eliminarProducto = async (req, res) => {
  try {
    const { id } = req.params;
    await productoService.eliminarProductoService(id);
    res.json({ mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    if (error.message === "PRODUCTO_NO_ENCONTRADO")
      return res.status(404).json({ mensaje: "Producto no encontrado" });
    res.status(500).json({ mensaje: "Error interno" });
  }
};
