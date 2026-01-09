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
        // update DB
        await user_repo_1.default.update(id, {
            Total_Amount: newTotal,
            Remaining_Amount: newRemaining,
        });
        // fetch updated record
        const updatedRecord = await user_repo_1.default.findbyid(id);
        // return meaningful response
        return {
            previous_total: previousTotal,
            added_amount: add_amount,
            total_amount: updatedRecord.Total_Amount,
            spent_amount: updatedRecord.Spent_Amount,
            remaining_amount: updatedRecord.Remaining_Amount,
        };
    }
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
    async delete(id) {
        // 1️⃣ delete आधी record आण
        const record = await user_repo_1.default.findbyid(id);
        if (!record) {
            throw new Error("User record not found");
        }
        // delete time
        const deletedAt = new Date();
        // 2️⃣ delete कर
        await user_repo_1.default.delete(id);
        // 3️⃣ meaningful response return कर
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
            deleted_at: deletedAt,
        };
    }
}
exports.default = new UserService();
