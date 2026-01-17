import bcrypt from "bcryptjs";
import AuthUserRepo from "../repository/auth-user.repo";
import UserRepo from "../repository/user.repo";

class UserService {

  async register(data: any) {
    const { first_name, last_name, password, Total_Amount } = data;

    const hash = await bcrypt.hash(password, 10);

    // 1️⃣ AUTH TABLE
    const authUser = await AuthUserRepo.create({
      first_name,
      last_name,
      password: hash,
    });

    // 2️⃣ EXPENSE TABLE (DASHBOARD BASE)
    await UserRepo.create({
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
    });

    return {
      user_id: authUser.id,
      first_name,
      last_name,
    };
  }

  async login(data: any) {
    const { first_name, last_name, password } = data;

    const user: any = await AuthUserRepo.findByName(first_name, last_name);
    if (!user) throw new Error("User not found");

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new Error("Invalid password");

    return {
      user_id: user.id,
      first_name,
      last_name,
    };
  }

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

  async addExpense(
    id: number,
    amount: number,
    category: string,
    description: string
  ) {
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

  async quickStats() {
    return await UserRepo.quickStats();
  }
  
async generateReport(first_name: string, last_name: string) {
    const record: any = await UserRepo.findByName(first_name, last_name);

    if (!record) {
      throw new Error("User not found");
    }

    return {
      first_name: record.First_Name,
      last_name: record.Last_Name,
      total_amount: record.Total_Amount,
      spent_amount: record.Spent_Amount,
      remaining_amount: record.Remaining_Amount,
      last_category: record.Category || "N/A",
      last_description: record.Description || "N/A",
      generated_at: new Date().toISOString(),
    };
  }
}

export default new UserService();
