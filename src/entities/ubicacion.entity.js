import { EntitySchema } from "typeorm";

export const Ubicacion = new EntitySchema({
  name: "Ubicacion",
  tableName: "ubicaciones",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    foto: {
      type: "text",
      nullable: true,
    },
    estante: {
      type: "int",
      nullable: true,
    },
    descripcion: {
      type: "varchar",
      length: 100,
      nullable: true,
    },
  },
  relations: {
    producto: {
      type: "many-to-one",
      target: "Producto",
      joinColumn: { name: "producto_id" },
      onDelete: "CASCADE",
    },
    bodega: {
      type: "many-to-one",
      target: "Bodega",
      joinColumn: { name: "bodega_id" },
      onDelete: "CASCADE",
    },
  },
});
