import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.config.js";
import indexRoutes from "./routes/index.routes.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); 
app.use("/api", indexRoutes);

app.get("/", (req, res) => {
  res.send("¡El Backend del Inventario BioGym está funcionando perfectamente!");
});

app.listen(PORT, async () => {
  console.log(`Servidor Express corriendo en el puerto ${PORT}`);
  await connectDB(); 
});