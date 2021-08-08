import { Model, DataTypes } from "sequelize";
import { sequelize } from "../config/database.connect";


interface BillingPlanInstance extends Model {
  billingId: number;
  title: string;
  description: string;
  userLimit: number;
  requestLimit: number;
  monthCoverage: number;
  amount: Boolean;
  addedby: string;
}

const billingPlanModel = sequelize.define(
  "billingplan",
  {
    billingId: {
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
    userLimit: {
      type: DataTypes.INTEGER,
    },
    requestLimit: {
      type: DataTypes.INTEGER,
    },
    monthCoverage: {
      type: DataTypes.INTEGER,
    },
    amount: {
      type: DataTypes.INTEGER,
    },
    addedBy: {
      type: DataTypes.INTEGER,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "billingplans",
    timestamps: true,
  }
);

billingPlanModel.removeAttribute('id');
export default billingPlanModel;
