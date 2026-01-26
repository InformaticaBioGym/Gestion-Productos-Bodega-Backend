import { Router } from "express";
import { registrarUsuario, loginUsuario } from "../controllers/auth.controller.js";
const router = Router();

import { validarEsquema } from "../middlewares/validador.middleware.js";
import { registroEsquema } from "../validations/auth.validation.js";

router.post("/registrar", validarEsquema(registroEsquema), registrarUsuario);
router.post("/login", loginUsuario);

export default router;