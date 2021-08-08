import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database.connect";
import administratorModel from "./administrators.model";


interface ClientInstance extends Model {
  clientId: number;
  organizationName: string;
  billingPlan: string;
  isSubscriptionExpired: Boolean;
  isactive: Boolean;
  isdeleted: Boolean;
  isverified: Boolean;
  addedby: string;
}

const clientModel = sequelize.define(
  "clients",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    organizationname: {
      type: DataTypes.STRING,
    },
    billingPlan:{
      type: DataTypes.INTEGER,
      defaultValue:1
    },
    no_of_users:{
      type: DataTypes.INTEGER,
    },
    no_of_projects:{
      type: DataTypes.INTEGER,
    },
    isSubscriptionActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0
    },
    store: {
      type: DataTypes.STRING,
    },
     isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue:1
    },
     isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue:0
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
    tableName: "clients",
    timestamps: true,
  }
);

// clientModel.hasOne(administratorModel, { as: "submittedby", foreignKey: "addedBy" });
export default clientModel;
