import { AppDataSource } from "../config/db.config.js";
import { Ubicacion } from "../entities/ubicacion.entity.js";
import { Bodega } from "../entities/bodega.entity.js";
import { Producto } from "../entities/producto.entity.js";
import { IsNull } from "typeorm";
import { ILike } from "typeorm";

const ubicacionRepository = AppDataSource.getRepository(Ubicacion);
const bodegaRepository = AppDataSource.getRepository(Bodega);
const productoRepository = AppDataSource.getRepository(Producto);

export const validarUbicacionAntesDeCriar = async (
  producto_id,
  bodega_id,
  estante,
) => {
  const producto = await productoRepository.findOneBy({ id: producto_id });
  if (!producto) throw new Error("PRODUCTO_NO_ENCONTRADO");

  const bodega = await bodegaRepository.findOneBy({ id: bodega_id });
  if (!bodega) throw new Error("BODEGA_NO_ENCONTRADA");

  if (estante && estante > bodega.n_estantes) {
    throw new Error("ESTANTE_INVALIDO");
  }

  const duplicado = await ubicacionRepository.findOne({
    where: {
      producto: { id: producto_id },
      bodega: { id: bodega_id },
      estante: estante || IsNull(),
    },
  });
  if (duplicado) {
    throw new Error("UBICACION_DUPLICADA");
  }
};

export const crearUbicacionService = async (datos) => {
  const bodega = await bodegaRepository.findOneBy({ id: datos.bodega_id });
  const producto = await productoRepository.findOneBy({
    id: datos.producto_id,
  });

  const nuevaUbicacion = ubicacionRepository.create({
    ...datos,
    producto,
    bodega,
  });

  return await ubicacionRepository.save(nuevaUbicacion);
};

export const obtenerUbicacionesService = async (termino) => {
  const query = ubicacionRepository
    .createQueryBuilder("ubicacion")
    .leftJoinAndSelect("ubicacion.producto", "producto")
    .leftJoinAndSelect("ubicacion.bodega", "bodega");

  if (termino) {
    query.where(
      "producto.sku ILIKE :termino OR producto.nombre ILIKE :termino",
      { termino: `%${termino}%` },
    );
  }

  return await query.getMany();
};

export const obtenerUbicacionPorIdService = async (id) => {
  const ubicacion = await ubicacionRepository.findOne({
    where: { id: parseInt(id) },
    relations: ["producto", "bodega"],
  });
  if (!ubicacion) throw new Error("UBICACION_NO_ENCONTRADA");
  return ubicacion;
};

export const editarUbicacionService = async (id, datos) => {
  const ubicacion = await ubicacionRepository.findOne({
    where: { id: parseInt(id) },
    relations: ["bodega", "producto"],
  });

  if (!ubicacion) throw new Error("UBICACION_NO_ENCONTRADA");
  const bodegaIdFinal = datos.bodega_id
    ? parseInt(datos.bodega_id)
    : ubicacion.bodega.id;
  const estanteFinal = datos.estante
    ? parseInt(datos.estante)
    : ubicacion.estante;
  if (datos.bodega_id || datos.estante) {
    const bodega = await bodegaRepository.findOneBy({ id: bodegaIdFinal });
    if (!bodega) throw new Error("BODEGA_NO_ENCONTRADA");

    if (estanteFinal > bodega.n_estantes) {
      throw new Error("ESTANTE_INVALIDO");
    }
  }
  if (datos.bodega_id || datos.estante !== undefined) {
    const duplicado = await ubicacionRepository.findOne({
      where: {
        producto: { id: ubicacion.producto.id },
        bodega: { id: bodegaIdFinal },
        estante: estanteFinal,
      },
    });
    if (duplicado && duplicado.id !== parseInt(id)) {
      throw new Error("UBICACION_DUPLICADA");
    }
  }

  ubicacionRepository.merge(ubicacion, datos);
  return await ubicacionRepository.save(ubicacion);
};

export const eliminarUbicacionService = async (id) => {
  const resultado = await ubicacionRepository.delete({ id: parseInt(id) });
  if (resultado.affected === 0) throw new Error("UBICACION_NO_ENCONTRADA");
  return true;
};
