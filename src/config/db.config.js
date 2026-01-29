import { DataSource } from "typeorm";
import "dotenv/config";
import bcrypt from "bcrypt";

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


//---Funcion para crear usuario admin---
async function crearAdminPorDefecto() {
  try {
    const usuarioRepository = AppDataSource.getRepository("Usuario");
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    const adminExistente = await usuarioRepository.findOne({
      where: { correo: adminEmail }
    });
    if (adminExistente) {
      console.log("✓ Usuario admin ya existe");
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const contraseñaEncriptada = await bcrypt.hash(adminPassword, salt);
    const nuevoAdmin = usuarioRepository.create({
      correo: adminEmail,
      nombre: "Administrador",
      contraseña: contraseñaEncriptada,
      rol: "administrador"
    });
    await usuarioRepository.save(nuevoAdmin);
  } catch (error) {
    console.error("Error al crear usuario admin:", error.message);
  }
}
//--------------------------------------

export async function connectDB() {
  try {
    await AppDataSource.initialize();
    console.log("Conexión exitosa a la base de datos de Supabase!");
    //---crear admin inicial----
    await crearAdminPorDefecto();
    //--------------------------
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
    process.exit(1);
  }
}