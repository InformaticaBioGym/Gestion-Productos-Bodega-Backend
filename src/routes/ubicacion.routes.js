import { Router } from "express";
import { 
  crearUbicacion, 
  obtenerUbicaciones, 
  obtenerUbicacion,
  obtenerPorProducto,
  editarUbicacion, 
  eliminarUbicacion,
  buscarPorSku 
} from "../controllers/ubicacion.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";
import { validarEsquema } from "../middlewares/validador.middleware.js";
import { crearUbicacionEsquema, editarUbicacionEsquema } from "../validations/ubicacion.validation.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = Router();

router.use(verificarToken);

router.get("/", obtenerUbicaciones);
router.get("/buscar-sku", buscarPorSku);
router.get("/:id", obtenerUbicacion);
router.get("/producto/:idProducto", obtenerPorProducto);
router.post("/", upload.single("foto"),validarEsquema(crearUbicacionEsquema), crearUbicacion);
router.put("/:id", upload.single("foto"), validarEsquema(editarUbicacionEsquema), editarUbicacion);
router.delete("/:id", eliminarUbicacion);

export default router;