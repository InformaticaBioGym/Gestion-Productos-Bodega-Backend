import express from "express";
import cors from "cors";
import { connectDB, AppDataSource } from "./config/db.config.js";
import indexRoutes from "./routes/index.routes.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(helmet()); 
app.use(cors());
app.use(express.json());

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    mensaje: "Has excedido el límite de intentos. Por favor, intenta de nuevo en 15 minutos."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "BioGym API",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get("/db-wake-up", async (req, res) => {
  try {
    await AppDataSource.query("SELECT 1");
    res.status(200).send("DB despierta");
  } catch (error) {
    console.error("Error en wake-up:", error);
    res.status(200).send("Intento de despertar realizado");
  }
});

app.use("/api/auth/login", loginLimiter);
app.use("/api", indexRoutes);

app.get("/", (req, res) => {
  res.send("¡El Backend del Inventario BioGym está funcionando perfectamente!");
});

app.listen(PORT, async () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  await connectDB();
});
