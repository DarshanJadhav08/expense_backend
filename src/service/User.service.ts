import bcrypt from "bcryptjs";
import sequelize from "../db/config";
import AuthUserRepo from "../repository/auth-user.repo";
import UserRepo from "../repository/user.repo";

class UserService {

  async register(data: any) {
    const { first_name, last_name, password, Total_Amount } = data;
    const t = await sequelize.transaction();

    try {
      const hashed = await bcrypt.hash(password, 10);

      const authUser: any = await AuthUserRepo.create(
        { first_name, last_name, password: hashed },
        { transaction: t }
      );

      const today = new Date();

      const expense: any = await UserRepo.create(
        {
          First_Name: first_name,
          Last_Name: last_name,
          Total_Amount,
          Spent_Amount: 0,
          Remaining_Amount: Total_Amount,
          Category: "N/A",
          Description: "Account Created",
          Date: today.getDate().toString(),
          Month: (today.getMonth() + 1).toString(),
          Year: today.getFullYear().toString(),
        },
        { transaction: t }
      );

      await t.commit();
      return { user_id: authUser.id, expense_id: expense.id };
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  async login(first: string, last: string, password: string) {
    const user: any = await AuthUserRepo.findByName(first, last);
    if (!user) throw new Error("Invalid credentials");

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new Error("Invalid credentials");

    return { user_id: user.id, first_name: user.first_name };
  }

  async create(data: any) {
    data.Spent_Amount = 0;
    data.Remaining_Amount = data.Total_Amount;
    return UserRepo.create(data);
  }

  async addMoneyByName(first: string, last: string, amount: number) {
    const user: any = await UserRepo.findByName(first, last);
    const newTotal = user.Total_Amount + amount;
    const newRemain = newTotal - user.Spent_Amount;

    await UserRepo.update(user.id, {
      Total_Amount: newTotal,
      Remaining_Amount: newRemain,
    });

    return { total_amount: newTotal, remaining_amount: newRemain };
  }

  async addExpense(id: number, expense: number, category: string, desc?: string) {
    const user: any = await UserRepo.findbyid(id);
    const spent = user.Spent_Amount + expense;
    const remain = user.Total_Amount - spent;

    if (remain < 0) throw new Error("Insufficient balance");

    await UserRepo.update(id, {
      Spent_Amount: spent,
      Remaining_Amount: remain,
      Category: category,
      Description: desc,
    });

    return { spent_amount: spent, remaining_amount: remain };
  }

  getAllUsers() {
    return UserRepo.getAllUsers();
  }

  quickStats() {
    return UserRepo.getQuickStats();
  }

  delete(id: number) {
    return UserRepo.delete(id);
  }
}

export default new UserService();
