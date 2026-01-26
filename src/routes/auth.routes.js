import { Router } from "express";
import { registrarUsuario, loginUsuario } from "../controllers/auth.controller.js";
import { validarEsquema } from "../middlewares/validador.middleware.js";
import { registroEsquema } from "../validations/auth.validation.js";
import { verificarToken, esAdministrador } from "../middlewares/auth.middleware.js";
const router = Router();

router.post("/registrar", verificarToken, esAdministrador, validarEsquema(registroEsquema), registrarUsuario);
router.post("/login", loginUsuario);

export default router;