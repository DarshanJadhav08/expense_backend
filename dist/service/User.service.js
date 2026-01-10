"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_repo_1 = __importDefault(require("../repository/user.repo"));
class UserService {
    async create(data) {
        if (!data.Total_Amount || data.Total_Amount <= 0) {
            throw new Error("Total_Amount is required and must be greater than 0");
        }
        data.Spent_Amount = 0;
        data.Remaining_Amount = data.Total_Amount;
        return await user_repo_1.default.create(data);
    }
    // 🔁 INTERNAL USE ONLY (controller मधून direct call नाही)
    async update(id, add_amount) {
        if (!add_amount || add_amount <= 0) {
            throw new Error("add_amount must be greater than 0");
        }
        const record = await user_repo_1.default.findbyid(id);
        if (!record)
            throw new Error("User record not found");
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
    // ✅ NAME BASED ADD MONEY
    async addMoneyByName(first, last, amount) {
        const user = await user_repo_1.default.findByName(first, last);
        if (!user)
            throw new Error("User not found");
        return await this.update(user.id, amount);
    }
    async getAllUsers() {
        return await user_repo_1.default.getAllUsers();
    }
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
    async addExpense(id, expense, category, description) {
        if (!expense || expense <= 0) {
            throw new Error("Expense amount must be greater than 0");
        }
        const record = await user_repo_1.default.findbyid(id);
        if (!record)
            throw new Error("User record not found");
        const newSpent = record.Spent_Amount + expense;
        const newRemaining = record.Total_Amount - newSpent;
        if (newRemaining < 0)
            throw new Error("Insufficient balance");
        return await user_repo_1.default.update(id, {
            Spent_Amount: newSpent,
            Remaining_Amount: newRemaining,
            Category: category,
            Description: description,
        });
    }
    async delete(id) {
        const record = await user_repo_1.default.findbyid(id);
        if (!record)
            throw new Error("User record not found");
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
