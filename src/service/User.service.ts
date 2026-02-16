import bcrypt from "bcryptjs";
import AuthUserRepo from "../repository/auth-user.repo";
import UserRepo from "../repository/user.repo";
import sequelize from "../db/config";

class UserService {

  async register(data: any) {
    const { first_name, last_name, password, Total_Amount } = data;

    // ✅ 1. VALIDATION FIRST
    if (!first_name || !last_name || !password) {
      throw new Error("first_name, last_name and password are required");
    }

    const exists = await AuthUserRepo.findByName(first_name, last_name);
    if (exists) {
      throw new Error("User already registered");
    }

    // ✅ 2. START TRANSACTION
    const t = await sequelize.transaction();

    try {
      const hash = await bcrypt.hash(password, 10);

      // ✅ 3. AUTH TABLE
      const authUser = await AuthUserRepo.create(
        {
          first_name,
          last_name,
          password: hash,
        },
        { transaction: t }
      );

      // ✅ 4. EXPENSE TABLE
      await UserRepo.create(
        {
          id: authUser.id,
          First_Name: first_name,
          Last_Name: last_name,
          Total_Amount: Total_Amount || 0,
          Spent_Amount: 0,
          Remaining_Amount: Total_Amount || 0,
          Category: "N/A",
          Description: "Account created",
          Date: new Date().toISOString().split("T")[0],
          Month: new Date().toLocaleString("default", { month: "long" }),
          Year: new Date().getFullYear().toString(),
        },
        { transaction: t }
      );

      // ✅ 5. COMMIT ONLY IF EVERYTHING OK
      await t.commit();

      return {
        id: authUser.id,
        first_name,
        last_name,
      };

    } catch (err) {
      // ❌ 6. ROLLBACK ON ERROR
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
      Total_Amount: expense.Total_Amount,
      Spent_Amount: expense.Spent_Amount,
      Remaining_Amount: expense.Remaining_Amount,
    };
  }

  // ===============================
  // ADD MONEY
  // ===============================
  async addMoney(first: string, last: string, amount: number, description: string) {
    const record: any = await UserRepo.findByName(first, last);
    if (!record) throw new Error("Expense record not found");

    const total = record.Total_Amount + amount;
    const remaining = record.Remaining_Amount + amount;

    await UserRepo.update(record.id, {
      Total_Amount: total,
      Remaining_Amount: remaining,
      Description: description,
    });

    return { total, remaining };
  }

  // ===============================
  // ADD EXPENSE
  // ===============================
  async addExpense(id: number, amount: number, category: string, description: string) {
    const record: any = await UserRepo.findById(id);
    if (!record) throw new Error("Expense record not found");

    const spent = record.Spent_Amount + amount;
    const remaining = record.Total_Amount - spent;

    if (remaining < 0) throw new Error("Insufficient balance");

    await UserRepo.update(id, {
      Spent_Amount: spent,
      Remaining_Amount: remaining,
      Category: category,
      Description: description,
    });

    return { spent, remaining };
  }

  // ===============================
  // QUICK STATS (USER WISE)
  // ===============================
  async quickStats(user_id: number) {
    const record: any = await UserRepo.findById(user_id);
    if (!record) throw new Error("User not found");

    return {
      total_amount: record.Total_Amount,
      spent_amount: record.Spent_Amount,
      remaining_amount: record.Remaining_Amount,
    };
  }

  // ===============================
  // GENERATE REPORT (SCREEN)
  // ===============================
  async generateReport(user_id: number) {
    const record: any = await UserRepo.findById(user_id);
    if (!record) throw new Error("User not found");

    return {
      first_name: record.First_Name,
      last_name: record.Last_Name,
      total_amount: record.Total_Amount,
      spent_amount: record.Spent_Amount,
      remaining_amount: record.Remaining_Amount,
      last_category: record.Category,
      last_description: record.Description,
      generated_at: new Date().toISOString(),
    };
  }
}

export default new UserService();
