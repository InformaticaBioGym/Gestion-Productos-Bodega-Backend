import { AppDataSource } from "../config/db.config.js";
import { Bodega } from "../entities/bodega.entity.js"; 

const bodegaRepository = AppDataSource.getRepository(Bodega);

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
  const resultado = await bodegaRepository.delete({ id: parseInt(id) });
  if (resultado.affected === 0) throw new Error("BODEGA_NO_ENCONTRADA");
  return true;
};