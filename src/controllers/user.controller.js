import * as userService from "../services/user.service.js";

export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await userService.obtenerUsuariosService();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener usuarios" });
  }
};

export const editarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioActualizado = await userService.editarUsuarioService(id, req.body);
    
    res.json({
      mensaje: "Usuario actualizado correctamente",
      usuario: usuarioActualizado
    });
  } catch (error) {
    if (error.message === "USUARIO_NO_ENCONTRADO") {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    if (error.message === "RUT_DUPLICADO") {
        return res.status(400).json({ mensaje: "El nuevo RUT ya está siendo usado por otro usuario." });
    }
    res.status(500).json({ mensaje: "Error interno" });
  }
};

export const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (req.usuario.id == id) { 
        return res.status(400).json({ mensaje: "No puedes eliminar tu propia cuenta de administrador" });
    }

    await userService.eliminarUsuarioService(id);
    res.json({ mensaje: "Usuario eliminado correctamente" });

  } catch (error) {
    if (error.message === "USUARIO_NO_ENCONTRADO") {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.status(500).json({ mensaje: "Error interno" });
  }
};