import { DataSource } from "typeorm";
import "dotenv/config";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL, 
  
  //Supabase exige conexion (SSL)
  ssl: {
    rejectUnauthorized: false,
  },

  entities: ["src/entities/**/*.js"], 
  synchronize: true, 
  logging: false,
});

export async function connectDB() {
  try {
    await AppDataSource.initialize();
    console.log("Conexión exitosa a la base de datos de Supabase!");
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
    process.exit(1);
  }
}