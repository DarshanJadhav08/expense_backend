import bcrypt from "bcryptjs";
import AuthUserRepo from "../repository/auth-user.repo";
import UserRepo from "../repository/user.repo";
import sequelize from "../db/config";

class UserService {

  // ===============================
  // REGISTER
  // ===============================
  async register(data: any) {
    const { first_name, last_name, password, total_amount } = data;

    if (!first_name || !last_name || !password) {
      throw new Error("first_name, last_name and password are required");
    }

    const exists = await AuthUserRepo.findByName(first_name, last_name);
    if (exists) {
      throw new Error("User already registered");
    }

    const t = await sequelize.transaction();

    try {
      const hash = await bcrypt.hash(password, 10);

      const authUser = await AuthUserRepo.create(
        {
          first_name,
          last_name,
          password: hash,
        },
        { transaction: t }
      );

      await UserRepo.create(
        {
          id: authUser.id,
          first_name,
          last_name,
          total_amount: total_amount || 0,
          expense_amount: 0,
          remaining_amount: total_amount || 0,
          category: "Initial",
          description: "Account created",
          created_at: new Date(),
        },
        { transaction: t }
      );

      await t.commit();

      return {
        id: authUser.id,
        first_name,
        last_name,
      };

    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  // ===============================
  // LOGIN
  // ===============================
  async login(data: any) {
    const { first_name, last_name, password } = data;

    const authUser: any = await AuthUserRepo.findByName(first_name, last_name);
    if (!authUser) throw new Error("User not found");

    const ok = await bcrypt.compare(password, authUser.password);
    if (!ok) throw new Error("Invalid password");

    const expense: any = await UserRepo.findById(authUser.id);
    if (!expense) throw new Error("Expense record not found");

    return {
      id: authUser.id,
      first_name,
      last_name,
      total_amount: expense.total_amount,
      expense_amount: expense.expense_amount,
      remaining_amount: expense.remaining_amount,
    };
  }

  // ===============================
  // ADD MONEY
  // ===============================
  async addMoney(first: string, last: string, amount: number, description: string) {
    const record: any = await UserRepo.findByName(first, last);
    if (!record) throw new Error("Expense record not found");

    await UserRepo.incrementAmounts(record.id, {
      total_amount: amount,
      remaining_amount: amount,
      description: description,
    });

    const updated: any = await UserRepo.findById(record.id);
    return { total: updated.total_amount, remaining: updated.remaining_amount };
  }

  // ===============================
  // ADD EXPENSE
  // ===============================
  async addExpense(id: number, amount: number, category: string, description: string) {
    const record: any = await UserRepo.findById(id);
    if (!record) throw new Error("Expense record not found");

    if (record.remaining_amount < amount) throw new Error("Insufficient balance");

    await UserRepo.incrementAmounts(id, {
      expense_amount: amount,
      remaining_amount: -amount,
      category: category,
      description: description,
    });

    const updated: any = await UserRepo.findById(id);
    return { spent: updated.expense_amount, remaining: updated.remaining_amount };
  }

  // ===============================
  // QUICK STATS
  // ===============================
  async quickStats(user_id: number) {
    const record: any = await UserRepo.findById(user_id);
    if (!record) throw new Error("User not found");

    return {
      total_amount: record.total_amount,
      spent_amount: record.expense_amount,
      remaining_amount: record.remaining_amount,
    };
  }

  // ===============================
  // GENERATE REPORT
  // ===============================
  async generateReport(user_id: number) {
    const record: any = await UserRepo.findById(user_id);
    if (!record) throw new Error("User not found");

    return {
      first_name: record.first_name,
      last_name: record.last_name,
      total_amount: record.total_amount,
      spent_amount: record.expense_amount,
      remaining_amount: record.remaining_amount,
      last_category: record.category,
      last_description: record.description,
      generated_at: new Date().toISOString(),
    };
  }
}

export default new UserService();
