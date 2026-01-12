"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_user_repo_1 = __importDefault(require("../repository/auth-user.repo"));
const user_repo_1 = __importDefault(require("../repository/user.repo"));
class UserService {
    // ===============================
    // ✅ REGISTER USER
    // auth_users + expense table
    // ===============================
    async register(data) {
        const { first_name, last_name, password, Total_Amount } = data;
        if (!first_name || !last_name || !password || !Total_Amount) {
            throw new Error("All fields are required");
        }
        // 🔐 hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // 1️⃣ auth_users table entry
        const authUser = await auth_user_repo_1.default.create({
            first_name,
            last_name,
            password: hashedPassword,
        });
        // 2️⃣ expense table entry
        const today = new Date();
        const expense = await user_repo_1.default.create({
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
        });
        return {
            user_id: authUser.id,
            expense_id: expense.id,
        };
    }
    // ===============================
    // ✅ LOGIN USER (auth_users table)
    // ===============================
    async login(first_name, last_name, password) {
        const user = await auth_user_repo_1.default.findByName(first_name, last_name);
        if (!user) {
            throw new Error("Invalid credentials");
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid credentials");
        }
        return {
            user_id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
        };
    }
    // ===============================
    // ✅ CREATE EXPENSE USER (OLD API)
    // ===============================
    async create(data) {
        if (!data.Total_Amount || data.Total_Amount <= 0) {
            throw new Error("Total_Amount must be greater than 0");
        }
        data.Spent_Amount = 0;
        data.Remaining_Amount = data.Total_Amount;
        return await user_repo_1.default.create(data);
    }
    // ===============================
    // 🔁 INTERNAL UPDATE (ADD MONEY)
    // ===============================
    async update(id, add_amount) {
        if (!add_amount || add_amount <= 0) {
            throw new Error("add_amount must be greater than 0");
        }
        const record = await user_repo_1.default.findbyid(id);
        if (!record) {
            throw new Error("User record not found");
        }
        const previousTotal = record.Total_Amount;
        const newTotal = record.Total_Amount + add_amount;
        const newRemaining = newTotal - record.Spent_Amount;
        await user_repo_1.default.update(id, {
            Total_Amount: newTotal,
            Remaining_Amount: newRemaining,
        });
        const updated = await user_repo_1.default.findbyid(id);
        return {
            previous_total: previousTotal,
            added_amount: add_amount,
            total_amount: updated.Total_Amount,
            spent_amount: updated.Spent_Amount,
            remaining_amount: updated.Remaining_Amount,
        };
    }
    // ===============================
    // ✅ ADD MONEY BY NAME
    // ===============================
    async addMoneyByName(first, last, amount) {
        const user = await user_repo_1.default.findByName(first, last);
        if (!user) {
            throw new Error("User not found");
        }
        return await this.update(user.id, amount);
    }
    // ===============================
    // ✅ GET ALL USERS (DROPDOWN)
    // ===============================
    async getAllUsers() {
        return await user_repo_1.default.getAllUsers();
    }
    // ===============================
    // ✅ QUICK STATS (DASHBOARD)
    // ===============================
    async quickStats() {
        const stats = await user_repo_1.default.getQuickStats();
        return {
            total_users: stats.totalUsers,
            total_balance: stats.totalBalance,
            todays_transactions: 0,
            avg_expense: stats.totalUsers > 0
                ? Math.round(stats.totalSpent / stats.totalUsers)
                : 0,
        };
    }
    // ===============================
    // ✅ ADD EXPENSE
    // ===============================
    async addExpense(id, expense, category, description) {
        if (!expense || expense <= 0) {
            throw new Error("Expense amount must be greater than 0");
        }
        const record = await user_repo_1.default.findbyid(id);
        if (!record) {
            throw new Error("User record not found");
        }
        const newSpent = record.Spent_Amount + expense;
        const newRemaining = record.Total_Amount - newSpent;
        if (newRemaining < 0) {
            throw new Error("Insufficient balance");
        }
        return await user_repo_1.default.update(id, {
            Spent_Amount: newSpent,
            Remaining_Amount: newRemaining,
            Category: category,
            Description: description,
        });
    }
    // ===============================
    // ✅ DELETE USER
    // ===============================
    async delete(id) {
        const record = await user_repo_1.default.findbyid(id);
        if (!record) {
            throw new Error("User record not found");
        }
        await user_repo_1.default.delete(id);
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
exports.default = new UserService();
