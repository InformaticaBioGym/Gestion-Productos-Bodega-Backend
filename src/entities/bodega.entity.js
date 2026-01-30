import { EntitySchema } from "typeorm";

export const Bodega = new EntitySchema({
  name: "Bodega",
  tableName: "bodegas",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    nombre: {
      type: "varchar",
      length: 100,
    },
    ubicacion_fisica: {
      type: "varchar",
      length: 200,
    },
    n_estantes: {
      type: "int",
    },
  },
  relations: {
    ubicaciones: {
      type: "one-to-many",
      target: "Ubicacion",
      inverseSide: "bodega",
    },
  },
});
