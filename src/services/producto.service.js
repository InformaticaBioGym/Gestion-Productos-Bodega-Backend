import { AppDataSource } from "../config/db.config.js";
import { Producto } from "../entities/producto.entity.js";
import { Ubicacion } from "../entities/ubicacion.entity.js";
import { eliminarImagen } from "../utils/cloudinary.utils.js";
import { ILike } from "typeorm";

const productoRepository = AppDataSource.getRepository(Producto);
const ubicacionRepository = AppDataSource.getRepository(Ubicacion);

export const crearProductoService = async (datos) => {
  const existeSku = await productoRepository.findOneBy({ sku: datos.sku });
  if (existeSku) throw new Error("SKU_DUPLICADO");

  const nuevoProducto = productoRepository.create(datos);
  return await productoRepository.save(nuevoProducto);
};

export const obtenerProductosService = async (termino) => {
  if (!termino) {
    return await productoRepository.find({ take: 50 });
  }
  return await productoRepository.find({
    where: [{ sku: ILike(`%${termino}%`) }, { nombre: ILike(`%${termino}%`) }],
  });
};

export const obtenerProductoPorIdService = async (id) => {
  const producto = await productoRepository.findOneBy({ id: parseInt(id) });
  if (!producto) throw new Error("PRODUCTO_NO_ENCONTRADO");
  return producto;
};

export const editarProductoService = async (id, datosActualizados) => {
  const producto = await obtenerProductoPorIdService(id);

  if (datosActualizados.sku && datosActualizados.sku !== producto.sku) {
    const skuOcupado = await productoRepository.findOneBy({
      sku: datosActualizados.sku,
    });
    if (skuOcupado) throw new Error("SKU_DUPLICADO");
  }

  productoRepository.merge(producto, datosActualizados);
  return await productoRepository.save(producto);
};

export const eliminarProductoService = async (id) => {
  const producto = await productoRepository.findOne({
    where: { id: parseInt(id) },
  });
  if (!producto) throw new Error("PRODUCTO_NO_ENCONTRADO");

  const ubicaciones = await ubicacionRepository.find({
    where: { producto: { id: parseInt(id) } },
  });
  const promesasEliminacion = ubicaciones.map((ubi) => {
    if (ubi.foto) {
      return eliminarImagen(ubi.foto);
    }
  });
  await Promise.all(promesasEliminacion);
  await productoRepository.delete({ id: parseInt(id) });

  return true;
};
