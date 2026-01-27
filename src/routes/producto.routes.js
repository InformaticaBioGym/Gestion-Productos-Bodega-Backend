import { Router } from "express";
import { 
  crearProducto, 
  obtenerProductos, 
  obtenerProducto, 
  editarProducto, 
  eliminarProducto 
} from "../controllers/product.controller.js";
import { verificarToken, esAdministrador } from "../middlewares/auth.middleware.js";
import { validarEsquema } from "../middlewares/validador.middleware.js";
import { crearProductoEsquema, editarProductoEsquema } from "../validations/product.validation.js";

const router = Router();

router.post("/", verificarToken, validarEsquema(crearProductoEsquema), crearProducto);
router.get("/", verificarToken, obtenerProductos);
router.get("/:id", verificarToken, obtenerProducto);
router.put("/:id", verificarToken, validarEsquema(editarProductoEsquema), editarProducto);

router.delete("/:id", verificarToken, esAdministrador, eliminarProducto);

export default router;