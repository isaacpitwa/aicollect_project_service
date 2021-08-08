import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database.connect";
import administratorRoleModel from "./administratorroles.model";
import clientModel from "./clients.model";


interface AmdinistratorInstance extends Model {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  firsttimeprocessor:string;
  processor:string;
  clientid: string;
  isactive: Boolean;
  isdeleted: Boolean;
  isverified: Boolean;
  timecreated: Date;
  lastlogintime: Date;
  phone:string;
  addedBy: string;
}

const administratorModel = sequelize.define(
  "administrators",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstname: {
      type: DataTypes.STRING,
    },
    lastname: {
      type: DataTypes.STRING,
    },
    userrole: {
      type: DataTypes.INTEGER,
    },
    email: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    firstTimeProcessor: {
      type: DataTypes.STRING,
    },
    processor: {
      type: DataTypes.STRING,
    },
    clientid: {
      type: DataTypes.INTEGER,
      defaultValue:null
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: 1
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    },
    addedBy: {
      type: DataTypes.INTEGER,
      defaultValue: null
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
    }
  },
  {
    tableName: "administrators",
    timestamps: true,
  }
);

administratorModel.belongsTo(administratorRoleModel, { foreignKey: "userrole" });
administratorModel.belongsTo(administratorModel, { as: "submittedby", foreignKey: "addedBy" });
administratorModel.belongsTo(clientModel, { as: "client", foreignKey: "clientid" });
clientModel.belongsTo(administratorModel, { as: "creator", foreignKey: "addedBy" });

export default administratorModel;
