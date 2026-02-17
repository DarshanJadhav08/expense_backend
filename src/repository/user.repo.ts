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

  async incrementAmounts(id: number, data: any) {
    const { total_amount, expense_amount, remaining_amount, category, description } = data;
    const updates: any = {};
    
    if (category) updates.category = category;
    if (description) updates.description = description;
    
    if (Object.keys(updates).length > 0) {
      await UserExpense.update(updates, { where: { id } });
    }
    
    const increments: any = {};
    if (total_amount) increments.total_amount = total_amount;
    if (expense_amount) increments.expense_amount = expense_amount;
    if (remaining_amount) increments.remaining_amount = remaining_amount;
    
    if (Object.keys(increments).length > 0) {
      await UserExpense.increment(increments, { where: { id } });
    }
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
