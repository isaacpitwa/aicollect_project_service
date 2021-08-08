import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database.connect";
import administratorModel from "./administrators.model";


interface companyLogsInstance extends Model {
  clientId: number;
  organizationName: string;
  billingPlan: string;
  isSubscriptionExpired: Boolean;
  isactive: Boolean;
  isdeleted: Boolean;
  isverified: Boolean;
  addedby: string;
}

const companyLogsModel = sequelize.define(
  "companylogs",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    clientid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
     log: {
      type: DataTypes.STRING,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "companylogs",
    timestamps: true,
  }
);

export default companyLogsModel;
