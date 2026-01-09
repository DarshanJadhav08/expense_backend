import { FastifyRequest, FastifyReply } from "fastify";
import UserService from "../service/User.service";

class UserController {

  // 1️⃣ CREATE USER / ACCOUNT
  async create(req: FastifyRequest, reply: FastifyReply) {
    try {
      const data = req.body as any;

      console.log("📥 CREATE BODY:", data); // 🔥 DEBUG

      const result = await UserService.create(data);

      return reply.status(201).send({
        success: true,
        message: "Account created successfully",
        data: result
      });

    } catch (error: any) {
      console.error("❌ CREATE ERROR:", error);

      return reply.status(400).send({
        success: false,
        error: error.message
      });
    }
  }

  // 2️⃣ ADD MONEY
  async add_money(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as any;
      const { add_amount } = req.body as any;

      console.log("💰 ADD MONEY:", { id, add_amount });

      const result = await UserService.update(id, add_amount);

      return reply.status(200).send({
        success: true,
        message: "Money added successfully",
        data: result
      });

    } catch (error: any) {
      console.error("❌ ADD MONEY ERROR:", error);

      return reply.status(400).send({
        success: false,
        error: error.message
      });
    }
  }

  // 3️⃣ ADD EXPENSE
  async addExpense(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as any;
      const { expense, category, description } = req.body as any;

      console.log("🧾 ADD EXPENSE:", { id, expense });

      const result = await UserService.addExpense(
        id,
        expense,
        category,
        description
      );

      return reply.status(200).send({
        success: true,
        message: "Expense added successfully",
        data: result
      });

    } catch (error: any) {
      console.error("❌ ADD EXPENSE ERROR:", error);

      return reply.status(400).send({
        success: false,
        error: error.message
      });
    }
  }

  // 4️⃣ DELETE USER
  async delete(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as any;

      const result = await UserService.delete(id);

      return reply.status(200).send({
        success: true,
        message: "Record deleted successfully",
        data: result
      });

    } catch (error: any) {
      console.error("❌ DELETE ERROR:", error);

      return reply.status(400).send({
        success: false,
        error: error.message
      });
    }
  }
}

export default new UserController();
