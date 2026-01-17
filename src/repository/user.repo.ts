import UserExpense from "../model/user.model";
import { fn, col } from "sequelize";

class UserRepo {
  create(data: any) {
    return UserExpense.create(data);
  }

  findById(id: number) {
    return UserExpense.findByPk(id);
  }

  findByName(first: string, last: string) {
    return UserExpense.findOne({
      where: { First_Name: first, Last_Name: last },
    });
  }

  update(id: number, data: any) {
    return UserExpense.update(data, { where: { id } });
  }

  getAll() {
    return UserExpense.findAll();
  }

  async quickStats() {
    const totals: any = await UserExpense.findOne({
      attributes: [
        [fn("SUM", col("Total_Amount")), "total"],
        [fn("SUM", col("Spent_Amount")), "spent"],
        [fn("SUM", col("Remaining_Amount")), "remaining"],
      ],
      raw: true,
    });

    return {
      total: Number(totals.total || 0),
      spent: Number(totals.spent || 0),
      remaining: Number(totals.remaining || 0),
    };
  }
}

export default new UserRepo();
