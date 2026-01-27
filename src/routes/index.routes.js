import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import productRoutes from "./producto.routes.js";
import bodegaRoutes from "./bodega.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/usuarios", userRoutes);
router.use("/productos", productRoutes);
router.use("/bodegas", bodegaRoutes);


export default router;