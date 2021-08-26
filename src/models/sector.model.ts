import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database.connect";
import administratorModel from "./administrators.model";
import questionaireModel from "./questionaires.model";


interface sectorModel extends Model {
  title: string;
  isActive:Boolean;
  isDeleted: Boolean;
  addedby: string;
}

const sectorModel = sequelize.define(
  "sectors",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
     isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue:0
    },
    addedBy: {
      type: DataTypes.INTEGER,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue:true
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue:sequelize.fn('NOW')
    },
    updatedAt: {
      allowNull: true,
      type: DataTypes.DATE,
      defaultValue:sequelize.fn('NOW')
    },
  },
  {
    tableName: "sectors",
    timestamps: true,
  }
);

sectorModel.belongsTo(administratorModel, { as: "submittedby", foreignKey: "addedBy" });
export default sectorModel;
