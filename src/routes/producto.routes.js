import { Router } from "express";
import { 
  crearProducto, 
  obtenerProductos, 
  obtenerProductoPorId, 
  editarProducto, 
  eliminarProducto
} from "../controllers/producto.controller.js";
import { verificarToken, esAdministrador } from "../middlewares/auth.middleware.js";
import { validarEsquema } from "../middlewares/validador.middleware.js";
import { crearProductoEsquema, editarProductoEsquema } from "../validations/producto.validation.js";

const router = Router();

router.use(verificarToken);
router.post("/", validarEsquema(crearProductoEsquema), crearProducto);
router.get("/", obtenerProductos);
router.get("/:id", obtenerProductoPorId);
router.put("/:id", validarEsquema(editarProductoEsquema), editarProducto);

router.delete("/:id", esAdministrador, eliminarProducto);

export default router;