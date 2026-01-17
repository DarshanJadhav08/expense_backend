import { DataTypes, Model } from "sequelize";
import sequelize from "../db/config";

class UserExpense extends Model {
  declare id: number;
  declare First_Name: string;
  declare Last_Name: string;
  declare Total_Amount: number;
  declare Spent_Amount: number;
  declare Remaining_Amount: number;
  declare Category: string;
  declare Description: string;
  declare Date: string;
  declare Month: string;
  declare Year: string;
}

UserExpense.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    First_Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Last_Name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Total_Amount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    Spent_Amount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    Remaining_Amount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    Category: {
      type: DataTypes.STRING,
      defaultValue: "N/A",
    },
    Description: {
      type: DataTypes.STRING,
    },
    Date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Month: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Year: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "expense",
    timestamps: true,
  }
);

export default UserExpense;
