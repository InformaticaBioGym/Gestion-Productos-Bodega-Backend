import { AppDataSource } from "../config/db.config.js";
import { Producto } from "../entities/Producto.js"; 

const productoRepository = AppDataSource.getRepository(Producto);

export const crearProductoService = async (datos) => {
  const existeSku = await productoRepository.findOneBy({ sku: datos.sku });
  if (existeSku) throw new Error("SKU_DUPLICADO");

  const nuevoProducto = productoRepository.create(datos);
  return await productoRepository.save(nuevoProducto);
};

export const obtenerProductosService = async () => {
  return await productoRepository.find();
};

export const obtenerProductoPorIdService = async (id) => {
  const producto = await productoRepository.findOneBy({ id: parseInt(id) });
  if (!producto) throw new Error("PRODUCTO_NO_ENCONTRADO");
  return producto;
};

export const editarProductoService = async (id, datosActualizados) => {
  const producto = await obtenerProductoPorIdService(id);

  if (datosActualizados.sku && datosActualizados.sku !== producto.sku) {
    const skuOcupado = await productoRepository.findOneBy({ sku: datosActualizados.sku });
    if (skuOcupado) throw new Error("SKU_DUPLICADO");
  }

  productoRepository.merge(producto, datosActualizados);
  return await productoRepository.save(producto);
};

export const eliminarProductoService = async (id) => {
  const resultado = await productoRepository.delete({ id: parseInt(id) });
  if (resultado.affected === 0) throw new Error("PRODUCTO_NO_ENCONTRADO");
  return true;
};