import { AppDataSource } from "../config/db.config.js";
import { Usuario } from "../entities/usuario.entity.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const usuarioRepository = AppDataSource.getRepository(Usuario);

export const registerService = async (datos) => {
  const { correo, contraseña, nombre, rol } = datos;
  const usuarioExistente = await usuarioRepository.findOneBy({ correo });
  if (usuarioExistente) {
    throw new Error("CORREO_DUPLICADO");
  }

  const salt = await bcrypt.genSalt(10);
  const contraseñaEncriptada = await bcrypt.hash(contraseña, salt);

  const nuevoUsuario = usuarioRepository.create({
    correo,
    nombre,
    contraseña: contraseñaEncriptada,
    rol: rol || "trabajador",
  });

  const usuarioGuardado = await usuarioRepository.save(nuevoUsuario);

  const usuarioLimpio = { ...usuarioGuardado };
  delete usuarioLimpio.contraseña;

  return usuarioLimpio;
};

export const loginService = async (correo, contraseña) => {
  const usuario = await usuarioRepository.findOneBy({ correo });

  if (!usuario) {
    throw new Error("USUARIO_NO_ENCONTRADO");
  }

  const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
  if (!contraseñaValida) {
    throw new Error("CONTRASEÑA_INCORRECTA");
  }

  const token = jwt.sign(
    { id: usuario.id, rol: usuario.rol, correo: usuario.correo },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  return { 
    token, 
    usuario: { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol } 
  };
};