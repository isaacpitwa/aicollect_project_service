import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database.connect";
import administratorModel from "./administrators.model";
import questionaireModel from "./questionaires.model";
import sectorModel from "./sector.model";


interface sectorModulesModel extends Model {
  modulename: string;
  moduledescription:string;
  type:string;
  ismandatory:Boolean;
  sectorid:Number;
  isdeleted: Boolean;
  addedby: string;
}

const sectorModulesModel = sequelize.define(
  "sectormodules",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    modulename: {
      type: DataTypes.STRING,
    },
    moduledescription: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    tag: {
      type: DataTypes.STRING,
    },
    sectorid: {
      type: DataTypes.NUMBER,
    },
    ismandatory: {
      type: DataTypes.BOOLEAN,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue:0
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue:true
    },
    addedBy: {
      type: DataTypes.INTEGER,
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
    tableName: "sectormodules",
    timestamps: true,
  }
);

sectorModulesModel.belongsTo(administratorModel, { as: "submittedby", foreignKey: "addedBy" });
sectorModulesModel.belongsTo(sectorModel, { as: "sectormodule", foreignKey: "sectorid" });

export default sectorModulesModel;
