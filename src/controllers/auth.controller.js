import * as authService from "../services/auth.service.js";

export const registrarUsuario = async (req, res) => {
  try {
    const usuario = await authService.registerService(req.body);

    res.status(201).json({
      mensaje: "Usuario registrado con éxito",
      usuario
    });

  } catch (error) {
    if (error.message === "CORREO_DUPLICADO") {
      return res.status(400).json({ mensaje: "El correo ya está registrado." });
    }
    console.error("Error al registrar:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

export const loginUsuario = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    const resultado = await authService.loginService(correo, contraseña);

    res.status(200).json({
      mensaje: "Inicio de sesión exitoso",
      ...resultado 
    });

  } catch (error) {
    if (error.message === "USUARIO_NO_ENCONTRADO") {
      return res.status(404).json({ mensaje: "El correo ingresado no está registrado." });
    }
    if (error.message === "CONTRASEÑA_INCORRECTA") {
      return res.status(401).json({ mensaje: "Contraseña incorrecta." });
    }
    console.error("Error en el login:", error);
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};