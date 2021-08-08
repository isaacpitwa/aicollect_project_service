import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database.connect";
import billingPlanModel from "./billingplan.model";


interface billingHistoryInstance extends Model {
  historyId: number;
  billingPlan: number;
  isPaymentCompleted: Boolean;
  subcriptionDate:Date;
  expiryDate:Date;
  addedby: string;
  amount:number;
}

const billingHistoryModel = sequelize.define(
  "billinghistory",
  {
    historyId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    billingPlan: {
      type: DataTypes.INTEGER,
    },
    isPaymentCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue:0
    },
    amount:{
      type:DataTypes.INTEGER,
    },
    subcriptionDate: {
      type: DataTypes.DATE,
    },
    expiryDate: {
      type: DataTypes.DATE,
    },
     addedBy: {
      type: DataTypes.INTEGER,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "billinghistory",
    timestamps: true,
  }
);

billingHistoryModel.belongsTo(billingPlanModel, { as: "plan", foreignKey: "billingPlan" });

billingHistoryModel.removeAttribute('id');
export default billingHistoryModel;
