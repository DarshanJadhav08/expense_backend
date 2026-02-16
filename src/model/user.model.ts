import { DataTypes, Model } from "sequelize";
import sequelize from "../db/config";

class UserExpense extends Model {
  declare id: number;
  declare first_name: string;
  declare last_name: string;
  declare total_amount: number;
  declare expense_amount: number;
  declare remaining_amount: number;
  declare category: string;
  declare description: string;
  declare created_at: Date;
}

UserExpense.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    total_amount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    expense_amount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    remaining_amount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    category: {
      type: DataTypes.STRING,
      defaultValue: "N/A",
    },
    description: {
      type: DataTypes.STRING,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "expense",
    timestamps: false,
  }
);

export default UserExpense;
