import { EntitySchema } from "typeorm";

export const Usuario = new EntitySchema({
  name: "Usuario",
  tableName: "usuarios",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    correo: {
      type: "varchar",
      length: 100,
      unique: true,
    },
    nombre: {
      type: "varchar",
      length: 100,
    },
    contraseña: {
      type: "varchar",
      length: 255,
    },
    rol: {
      type: "varchar",
      length: 20,
      default: "trabajador", // 'trabajador' o 'administrador'
    },
  },
});
