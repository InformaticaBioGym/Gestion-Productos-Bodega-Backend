import { Router } from "express";
import {
  crearBodega,
  obtenerBodegas,
  obtenerBodega,
  editarBodega,
  eliminarBodega,
} from "../controllers/bodega.controller.js";
import {
  verificarToken,
  esAdministrador,
} from "../middlewares/auth.middleware.js";
import { validarEsquema } from "../middlewares/validador.middleware.js";
import {
  crearBodegaEsquema,
  editarBodegaEsquema,
} from "../validations/bodega.validation.js";

const router = Router();
router.use(verificarToken);
router.get("/", obtenerBodegas);
router.get("/:id", obtenerBodega);

router.use(esAdministrador);

router.post("/", validarEsquema(crearBodegaEsquema), crearBodega);
router.put("/:id", validarEsquema(editarBodegaEsquema), editarBodega);
router.delete("/:id", eliminarBodega);

export default router;
