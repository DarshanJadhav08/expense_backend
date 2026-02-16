import UserExpense from "../model/user.model";
import { fn, col } from "sequelize";

class UserRepo {

  create(data: any, options?: any) {
    return UserExpense.create(data, options);
  }

  findById(id: number) {
    return UserExpense.findByPk(id);
  }

  findByName(first: string, last: string) {
    return UserExpense.findOne({
      where: { 
        first_name: first, 
        last_name: last 
      },
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
        [fn("SUM", col("total_amount")), "total"],
        [fn("SUM", col("expense_amount")), "spent"],
        [fn("SUM", col("remaining_amount")), "remaining"],
      ],
      raw: true,
    });

    return {
      total: Number(totals?.total || 0),
      spent: Number(totals?.spent || 0),
      remaining: Number(totals?.remaining || 0),
    };
  }
}

export default new UserRepo();
