"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_user_repo_1 = __importDefault(require("../repository/auth-user.repo"));
const user_repo_1 = __importDefault(require("../repository/user.repo"));
class UserService {
    async register(data) {
        const { first_name, last_name, password, Total_Amount } = data;
        // 🔒 VALIDATION (VERY IMPORTANT)
        if (!first_name || !last_name || !password) {
            throw new Error("first_name, last_name and password are required");
        }
        if (password.length < 6) {
            throw new Error("Password must be at least 6 characters");
        }
        if (Total_Amount !== undefined && Total_Amount < 0) {
            throw new Error("Total_Amount must be >= 0");
        }
        const hash = await bcryptjs_1.default.hash(password, 10);
        // 1️⃣ AUTH TABLE
        const authUser = await auth_user_repo_1.default.create({
            first_name,
            last_name,
            password: hash,
        });
        // 2️⃣ EXPENSE TABLE
        await user_repo_1.default.create({
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
        });
        return {
            id: authUser.id,
            first_name,
            last_name,
        };
    }
    // ===============================
    // LOGIN
    // ===============================
    async login(data) {
        const { first_name, last_name, password } = data;
        const user = await auth_user_repo_1.default.findByName(first_name, last_name);
        if (!user)
            throw new Error("User not found");
        const ok = await bcryptjs_1.default.compare(password, user.password);
        if (!ok)
            throw new Error("Invalid password");
        return {
            id: user.id,
            first_name,
            last_name,
        };
    }
    // ===============================
    // ADD MONEY (USER WISE)
    // ===============================
    async addMoney(userId, amount, description) {
        const record = await user_repo_1.default.findById(userId);
        if (!record)
            throw new Error("Expense record not found");
        const total = record.Total_Amount + amount;
        const remaining = record.Remaining_Amount + amount;
        await user_repo_1.default.update(userId, {
            Total_Amount: total,
            Remaining_Amount: remaining,
            Description: description,
        });
        return { total, remaining };
    }
    // ===============================
    // ADD EXPENSE (USER WISE)
    // ===============================
    async addExpense(userId, amount, category, description) {
        const record = await user_repo_1.default.findById(userId);
        if (!record)
            throw new Error("Expense record not found");
        const spent = record.Spent_Amount + amount;
        const remaining = record.Total_Amount - spent;
        if (remaining < 0)
            throw new Error("Insufficient balance");
        await user_repo_1.default.update(userId, {
            Spent_Amount: spent,
            Remaining_Amount: remaining,
            Category: category,
            Description: description,
        });
        return { spent, remaining };
    }
    // ===============================
    // QUICK STATS (ONLY LOGIN USER)
    // ===============================
    async quickStats(userId) {
        const record = await user_repo_1.default.findById(userId);
        if (!record)
            throw new Error("Expense record not found");
        return {
            total: record.Total_Amount,
            spent: record.Spent_Amount,
            remaining: record.Remaining_Amount,
        };
    }
    // ===============================
    // GENERATE REPORT (USER ID BASED)
    // ===============================
    async generateReport(userId) {
        const record = await user_repo_1.default.findById(userId);
        if (!record)
            throw new Error("User not found");
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
exports.default = new UserService();
