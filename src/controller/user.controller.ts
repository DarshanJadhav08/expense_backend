import { FastifyRequest, FastifyReply } from "fastify";
import UserService from "../service/User.service";

class UserController {

  // ✅ CREATE USER
  async create(req: FastifyRequest, reply: FastifyReply) {
    const result = await UserService.create(req.body);
    return reply.status(201).send({
      success: true,
      message: "Account created successfully",
      data: result,
    });
  }

  // ❌ OLD add_money(id) REMOVED COMPLETELY

  // ✅ ADD MONEY BY NAME (ONLY THIS)
  async addMoneyByName(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { first_name, last_name, add_amount } = req.body as any;

      const result = await UserService.addMoneyByName(
        first_name,
        last_name,
        add_amount
      );

      return reply.send({
        success: true,
        message: "Money added successfully",
        data: result,
      });
    } catch (error: any) {
      return reply.status(400).send({
        success: false,
        error: error.message,
      });
    }
  }

  // ✅ ADD EXPENSE (ID still required internally)
  async addExpense(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as any;
    const { expense, category, description } = req.body as any;

    const result = await UserService.addExpense(
      id,
      expense,
      category,
      description
    );

    return reply.send({
      success: true,
      message: "Expense added successfully",
      data: result,
    });
  }

  // ✅ GET ALL USERS
  async getUsers(req: FastifyRequest, reply: FastifyReply) {
    const users = await UserService.getAllUsers();
    return reply.send({ success: true, data: users });
  }

  // ✅ QUICK STATS
  async quickStats(req: FastifyRequest, reply: FastifyReply) {
    const stats = await UserService.quickStats();
    return reply.send({ success: true, data: stats });
  }

  // ✅ DELETE USER
  async delete(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as any;
    const result = await UserService.delete(id);
    return reply.send({ success: true, data: result });
  }
}

export default new UserController();
