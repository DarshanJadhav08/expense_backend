import UserRepo from "../repository/user.repo";

class UserService {

  async create(data: any) {
    if (!data.Total_Amount || data.Total_Amount <= 0) {
      throw new Error("Total_Amount is required and must be greater than 0");
    }

    data.Spent_Amount = 0;
    data.Remaining_Amount = data.Total_Amount;

    return await UserRepo.create(data);
  }

  // 🔁 INTERNAL USE ONLY (controller मधून direct call नाही)
  async update(id: string, add_amount: number) {
    if (!add_amount || add_amount <= 0) {
      throw new Error("add_amount must be greater than 0");
    }

    const record: any = await UserRepo.findbyid(id);
    if (!record) throw new Error("User record not found");

    const previousTotal = record.Total_Amount;
    const newTotal = record.Total_Amount + add_amount;
    const newRemaining = newTotal - record.Spent_Amount;

    await UserRepo.update(id, {
      Total_Amount: newTotal,
      Remaining_Amount: newRemaining,
    });

    const updated: any = await UserRepo.findbyid(id);

    return {
      previous_total: previousTotal,
      added_amount: add_amount,
      total_amount: updated.Total_Amount,
      spent_amount: updated.Spent_Amount,
      remaining_amount: updated.Remaining_Amount,
    };
  }

  // ✅ NAME BASED ADD MONEY
  async addMoneyByName(first: string, last: string, amount: number) {
    const user: any = await UserRepo.findByName(first, last);
    if (!user) throw new Error("User not found");

    return await this.update(user.id, amount);
  }

  async getAllUsers() {
    return await UserRepo.getAllUsers();
  }

  async quickStats() {
    const stats = await UserRepo.getQuickStats();

    return {
      total_users: stats.totalUsers,
      total_balance: stats.totalBalance,
      todays_transactions: 0,
      avg_expense:
        stats.totalUsers > 0
          ? Math.round(stats.totalSpent / stats.totalUsers)
          : 0,
    };
  }

  async addExpense(
    id: string,
    expense: number,
    category: string,
    description?: string
  ) {
    if (!expense || expense <= 0) {
      throw new Error("Expense amount must be greater than 0");
    }

    const record: any = await UserRepo.findbyid(id);
    if (!record) throw new Error("User record not found");

    const newSpent = record.Spent_Amount + expense;
    const newRemaining = record.Total_Amount - newSpent;

    if (newRemaining < 0) throw new Error("Insufficient balance");

    return await UserRepo.update(id, {
      Spent_Amount: newSpent,
      Remaining_Amount: newRemaining,
      Category: category,
      Description: description,
    });
  }

  async delete(id: string) {
    const record: any = await UserRepo.findbyid(id);
    if (!record) throw new Error("User record not found");

    await UserRepo.delete(id);

    return {
      deleted_user: {
        id: record.id,
        First_Name: record.First_Name,
        Last_Name: record.Last_Name,
      },
      money_status: {
        total_amount: record.Total_Amount,
        spent_amount: record.Spent_Amount,
        remaining_amount: record.Remaining_Amount,
      },
      deleted_at: new Date(),
    };
  }
}

export default new UserService();
