import { EntitySchema } from "typeorm";

export const Producto = new EntitySchema({
  name: "Producto",
  tableName: "productos",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    sku: {
      type: "varchar",
      length: 50,
      unique: true,
    },
    codigo_barra: {
      type: "varchar",
      length: 50,
      unique: true,
      nullable: true,
    },
    observaciones: {
      type: "text",
      nullable: true,
    },
    nombre: {
      type: "varchar",
      length: 100,
    },
  },
  relations: {
    ubicaciones: {
      type: "one-to-many",
      target: "Ubicacion",
      inverseSide: "producto",
    },
  },
});
