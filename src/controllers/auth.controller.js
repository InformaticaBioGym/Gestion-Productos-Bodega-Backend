import { AppDataSource } from "../config/db.config.js";
import bcrypt from "bcrypt";
import { loginService } from "../services/auth.service.js";

export const registrarUsuario = async (req, res) => {
  try {
    const { rut, nombre, contraseña, rol } = req.body;

    const usuarioRepository = AppDataSource.getRepository("Usuario");

    const usuarioExistente = await usuarioRepository.findOneBy({ rut });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: "Este RUT ya está registrado." });
    }

    const salt = await bcrypt.genSalt(10);
    const contraseñaEncriptada = await bcrypt.hash(contraseña, salt);

    const nuevoUsuario = usuarioRepository.create({
      rut,
      nombre,
      contraseña: contraseñaEncriptada,
      rol: rol || "trabajador",
    });

    await usuarioRepository.save(nuevoUsuario);

    res.status(201).json({
      mensaje: "Usuario registrado con éxito",
      usuario: {
        rut: nuevoUsuario.rut,
        nombre: nuevoUsuario.nombre,
        rol: nuevoUsuario.rol,
      },
    });
  } catch (error) {
    console.error("Error al registrar:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

export const loginUsuario = async (req, res) => {
  try {
    const { rut, contraseña } = req.body;

    const resultado = await loginService(rut, contraseña);

    res.status(200).json({
      mensaje: "Inicio de sesión exitoso",
      ...resultado 
    });

  } catch (error) {
    if (error.message === "USUARIO_NO_ENCONTRADO") {
      return res.status(404).json({ mensaje: "El RUT ingresado no está registrado." });
    }
    if (error.message === "CONTRASEÑA_INCORRECTA") {
      return res.status(401).json({ mensaje: "Contraseña incorrecta." });
    }
    console.error("Error en el login:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};