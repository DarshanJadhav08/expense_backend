import { fn, col } from "sequelize";
import User from "../model/user.model";

class UserRepo {
  create(data: any, options?: any) {
    return User.create(data, options);
  }

  findbyid(id: number | string) {
    return User.findByPk(id);
  }

  update(id: number | string, data: any) {
    return User.update(data, { where: { id } });
  }

  delete(id: number | string) {
    return User.destroy({ where: { id } });
  }

  getAllUsers() {
    return User.findAll({
      attributes: ["id", "First_Name", "Last_Name"],
    });
  }

  findByName(first: string, last: string) {
    return User.findOne({
      where: { First_Name: first, Last_Name: last },
    });
  }

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
