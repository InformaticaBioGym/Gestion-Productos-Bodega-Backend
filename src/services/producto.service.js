import { AppDataSource } from "../config/db.config.js";
import { Producto } from "../entities/producto.entity.js";
import { Ubicacion } from "../entities/ubicacion.entity.js";
import { eliminarImagen } from "../utils/cloudinary.utils.js";
import { ILike } from "typeorm";

const productoRepository = AppDataSource.getRepository(Producto);
const ubicacionRepository = AppDataSource.getRepository(Ubicacion);

const limpiarDatos = (datos) => {
  const nuevosDatos = { ...datos };
  if (nuevosDatos.codigo_barra === "") {
    nuevosDatos.codigo_barra = null;
  }
  return nuevosDatos;
};

export const crearProductoService = async (datos) => {
  const datosLimpios = limpiarDatos(datos);
  const existeSku = await productoRepository.findOneBy({ sku: datosLimpios.sku });
  if (existeSku) throw new Error("SKU_DUPLICADO");

  if (datosLimpios.codigo_barra) {
    const existeBarra = await productoRepository.findOneBy({
      codigo_barra: datosLimpios.codigo_barra,
    });
    if (existeBarra) throw new Error("CODIGO_BARRA_DUPLICADO");
  }
  const nuevoProducto = productoRepository.create(datosLimpios);
  return await productoRepository.save(nuevoProducto);
};

export const obtenerProductosService = async (termino) => {
  if (!termino) {
    return await productoRepository.find({ take: 50 });
  }
  const terminoLimpio = termino.trim();
  const coincidenciaExacta = await productoRepository.findOne({
    where: [
      { codigo_barra: terminoLimpio },
      { sku: terminoLimpio } 
    ]
  });
  if (coincidenciaExacta) {
    return [coincidenciaExacta];
  }
  return await productoRepository.find({
    where: [
      { sku: ILike(`%${terminoLimpio}%`) },
      { nombre: ILike(`%${terminoLimpio}%`) },
      { codigo_barra: ILike(`%${terminoLimpio}%`) },
    ],
  });
};

export const obtenerProductoPorIdService = async (id) => {
  const producto = await productoRepository.findOneBy({ id: parseInt(id) });
  if (!producto) throw new Error("PRODUCTO_NO_ENCONTRADO");
  return producto;
};

export const editarProductoService = async (id, datosActualizados) => {
  const producto = await obtenerProductoPorIdService(id);
  const datosLimpios = limpiarDatos(datosActualizados);

  if (datosLimpios.sku && datosLimpios.sku !== producto.sku) {
    const skuOcupado = await productoRepository.findOneBy({
      sku: datosLimpios.sku,
    });
    if (skuOcupado) throw new Error("SKU_DUPLICADO");
  }
  if (
    datosLimpios.codigo_barra &&
    datosLimpios.codigo_barra !== producto.codigo_barra
  ) {
    const barraOcupada = await productoRepository.findOneBy({
      codigo_barra: datosLimpios.codigo_barra,
    });
    if (barraOcupada) throw new Error("CODIGO_BARRA_DUPLICADO");
  }

  productoRepository.merge(producto, datosLimpios);
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
