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
        const hash = await bcryptjs_1.default.hash(password, 10);
        // 1️⃣ AUTH TABLE
        const authUser = await auth_user_repo_1.default.create({
            first_name,
            last_name,
            password: hash,
        });
        // 2️⃣ EXPENSE TABLE (DASHBOARD BASE)
        await user_repo_1.default.create({
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
    async login(data) {
        const { first_name, last_name, password } = data;
        const user = await auth_user_repo_1.default.findByName(first_name, last_name);
        if (!user)
            throw new Error("User not found");
        const ok = await bcryptjs_1.default.compare(password, user.password);
        if (!ok)
            throw new Error("Invalid password");
        return {
            user_id: user.id,
            first_name,
            last_name,
        };
    }
    async addMoney(first, last, amount, description) {
        const record = await user_repo_1.default.findByName(first, last);
        if (!record)
            throw new Error("Expense record not found");
        const total = record.Total_Amount + amount;
        const remaining = record.Remaining_Amount + amount;
        await user_repo_1.default.update(record.id, {
            Total_Amount: total,
            Remaining_Amount: remaining,
            Description: description,
        });
        return { total, remaining };
    }
    async addExpense(id, amount, category, description) {
        const record = await user_repo_1.default.findById(id);
        if (!record)
            throw new Error("Expense record not found");
        const spent = record.Spent_Amount + amount;
        const remaining = record.Total_Amount - spent;
        if (remaining < 0)
            throw new Error("Insufficient balance");
        await user_repo_1.default.update(id, {
            Spent_Amount: spent,
            Remaining_Amount: remaining,
            Category: category,
            Description: description,
        });
        return { spent, remaining };
    }
    async quickStats() {
        return await user_repo_1.default.quickStats();
    }
}
exports.default = new UserService();
