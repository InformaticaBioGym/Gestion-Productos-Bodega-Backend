import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.config.js";
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

app.use("/api/auth/login", loginLimiter);
app.use("/api", indexRoutes);

app.get("/", (req, res) => {
  res.send("¡El Backend del Inventario BioGym está funcionando perfectamente!");
});

app.listen(PORT, async () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
  await connectDB();
});
