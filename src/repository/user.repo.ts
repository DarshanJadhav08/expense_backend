import { fn, col } from "sequelize";
import User from "../model/user.model";

class UserRepo {
  async create(data: any) {
    return await User.create(data);
  }

  async findbyid(id: string) {
    return await User.findByPk(id);
  }

  async update(id: string, data: any) {
    return await User.update(data, { where: { id } });
  }

  async delete(id: string) {
    return await User.destroy({ where: { id } });
  }

  // ✅ NEW: all users for dropdown
  async getAllUsers() {
    return await User.findAll({
      attributes: ["id", "First_Name", "Last_Name"],
    });
  }

  // ✅ NEW: find user by name
  async findByName(firstName: string, lastName: string) {
    return await User.findOne({
      where: {
        First_Name: firstName,
        Last_Name: lastName,
      },
    });
  }

  // ✅ NEW: quick stats
  async getQuickStats() {
    const totalUsers = await User.count();

    const totals: any = await User.findOne({
      attributes: [
        [fn("SUM", col("Total_Amount")), "total_balance"],
        [fn("SUM", col("Spent_Amount")), "total_spent"],
      ],
      raw: true,
    });

    return {
      totalUsers,
      totalBalance: Number(totals?.total_balance || 0),
      totalSpent: Number(totals?.total_spent || 0),
    };
  }
}

export default new UserRepo();
