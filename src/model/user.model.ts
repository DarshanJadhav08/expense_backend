import { DataTypes, Model } from "sequelize";
import sequelize from "../db/config";

class User extends Model {}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    First_Name: { type: DataTypes.STRING, allowNull: false },
    Last_Name: { type: DataTypes.STRING, allowNull: false },
    Total_Amount: { type: DataTypes.INTEGER, allowNull: false },
    Spent_Amount: { type: DataTypes.INTEGER, defaultValue: 0 },
    Remaining_Amount: { type: DataTypes.INTEGER, defaultValue: 0 },
    Category: { type: DataTypes.STRING, defaultValue: "N/A" },
    Description: { type: DataTypes.STRING },
    Date: { type: DataTypes.STRING },
    Month: { type: DataTypes.STRING },
    Year: { type: DataTypes.STRING },
  },
  {
    sequelize,
    tableName: "expense",
    timestamps: true,
  }
);

export default User;
