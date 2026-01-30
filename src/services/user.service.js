import { AppDataSource } from "../config/db.config.js";
import bcrypt from "bcrypt";

const usuarioRepository = AppDataSource.getRepository("Usuario");

export const obtenerUsuariosService = async () => {
  const usuarios = await usuarioRepository.find({
    select: ["id", "correo", "nombre", "rol"],
  });
  return usuarios;
};

export const obtenerUsuarioPorIdService = async (id) => {
  const usuario = await usuarioRepository.findOne({
    where: { id: parseInt(id) },
    select: ["id", "correo", "nombre", "rol"],
  });

  if (!usuario) {
    throw new Error("USUARIO_NO_ENCONTRADO");
  }

  return usuario;
};

export const editarUsuarioService = async (id, datosActualizados) => {
  const usuario = await usuarioRepository.findOneBy({ id: parseInt(id) });
  if (!usuario) {
    throw new Error("USUARIO_NO_ENCONTRADO");
  }

  if (datosActualizados.correo && datosActualizados.correo !== usuario.correo) {
    const correoOcupado = await usuarioRepository.findOneBy({
      correo: datosActualizados.correo,
    });
    if (correoOcupado) {
      throw new Error("CORREO_DUPLICADO");
    }
  }

  if (datosActualizados.contraseña) {
    const salt = await bcrypt.genSalt(10);
    datosActualizados.contraseña = await bcrypt.hash(
      datosActualizados.contraseña,
      salt,
    );
  }

  usuarioRepository.merge(usuario, datosActualizados);
  const resultado = await usuarioRepository.save(usuario);

  delete resultado.contraseña;
  return resultado;
};

export const eliminarUsuarioService = async (id) => {
  const resultado = await usuarioRepository.delete({ id: parseInt(id) });

  if (resultado.affected === 0) {
    throw new Error("USUARIO_NO_ENCONTRADO");
  }

  return true;
};
