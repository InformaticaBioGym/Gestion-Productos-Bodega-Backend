import { AppDataSource } from "../config/db.config.js";
import { Bodega } from "../entities/bodega.entity.js";
import { Ubicacion } from "../entities/ubicacion.entity.js";
import { eliminarImagen } from "../utils/cloudinary.utils.js";

const bodegaRepository = AppDataSource.getRepository(Bodega);
const ubicacionRepository = AppDataSource.getRepository(Ubicacion);

export const crearBodegaService = async (datos) => {
  const nuevaBodega = bodegaRepository.create(datos);
  return await bodegaRepository.save(nuevaBodega);
};

export const obtenerBodegasService = async () => {
  return await bodegaRepository.find();
};

export const obtenerBodegaPorIdService = async (id) => {
  const bodega = await bodegaRepository.findOneBy({ id: parseInt(id) });
  if (!bodega) throw new Error("BODEGA_NO_ENCONTRADA");
  return bodega;
};

export const editarBodegaService = async (id, datosActualizados) => {
  const bodega = await obtenerBodegaPorIdService(id);
  bodegaRepository.merge(bodega, datosActualizados);
  return await bodegaRepository.save(bodega);
};

export const eliminarBodegaService = async (id) => {
  const bodega = await bodegaRepository.findOne({
    where: { id: parseInt(id) },
  });
  if (!bodega) throw new Error("BODEGA_NO_ENCONTRADA");
  const ubicaciones = await ubicacionRepository.find({
    where: { bodega: { id: parseInt(id) } },
  });
  const promesasEliminacion = ubicaciones.map((ubi) => {
    if (ubi.foto) {
      return eliminarImagen(ubi.foto);
    }
  });
  await Promise.all(promesasEliminacion);
  await bodegaRepository.delete({ id: parseInt(id) });

  return true;
};
