import { AppDataSource } from "../config/db.config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const loginService = async (rut, contraseña) => {
  const usuarioRepository = AppDataSource.getRepository("Usuario");
  const usuario = await usuarioRepository.findOneBy({ rut });

  if (!usuario) {
    throw new Error("USUARIO_NO_ENCONTRADO");
  }

  const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);
  if (!contraseñaValida) {
    throw new Error("CONTRASEÑA_INCORRECTA");
  }

  const token = jwt.sign(
    { id: usuario.id, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  return { 
    token, 
    usuario: { nombre: usuario.nombre, rol: usuario.rol } 
  };
};