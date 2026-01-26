import { Router } from "express";
import { obtenerUsuarios, editarUsuario, eliminarUsuario } from "../controllers/user.controller.js";
import { verificarToken, esAdministrador } from "../middlewares/auth.middleware.js";
import { validarEsquema } from "../middlewares/validador.middleware.js";
import { editarUsuarioEsquema } from "../validations/user.validation.js";

const router = Router();

router.use(verificarToken, esAdministrador);

router.get("/", obtenerUsuarios);
router.put("/:id", validarEsquema(editarUsuarioEsquema), editarUsuario); 
router.delete("/:id", eliminarUsuario);

export default router;