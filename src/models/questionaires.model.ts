import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database.connect";
import administratorModel from "./administrators.model";
import sectorModel from "./sector.model";
import sectorModulesModel from "./sectormodules.model";



const questionaireModel = sequelize.define(
  "questionaires",
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
    tag: {
      type: DataTypes.STRING,
    },
    ismandatory : {
      type: DataTypes.BOOLEAN,
      defaultValue:0
    },
    sectorid : {
      type: DataTypes.INTEGER,
    },
    moduleid : {
      type: DataTypes.INTEGER,
      defaultValue:null
    },
    parentid: {
      type: DataTypes.INTEGER,
      defaultValue:null
    },
    formschema:{
      type: DataTypes.JSONB
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
    tableName: "questionaires",
    timestamps: true,
  }
);

questionaireModel.belongsTo(administratorModel, { as: "submittedby", foreignKey: "addedBy" });
questionaireModel.belongsTo(questionaireModel, { as: "clonnedFrom", foreignKey: "parentid" });
questionaireModel.belongsTo(sectorModel, { as: "sector", foreignKey: "sectorid" });
questionaireModel.belongsTo(sectorModulesModel, {foreignKey: 'moduleid'});
sectorModulesModel.hasMany(questionaireModel, {as:'questionaires',foreignKey: 'moduleid'});

export default questionaireModel;
