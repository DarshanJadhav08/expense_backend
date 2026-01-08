import { DataTypes, Model } from "sequelize";
import sequelize from "../db/config";

class Expense extends Model {
  declare id: string;

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

Expense.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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
      allowNull: false,
      defaultValue: 0,
    },

    Spent_Amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    Remaining_Amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    Category: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    Description: {
      type: DataTypes.STRING,
      allowNull: true,
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

export default Expense;
