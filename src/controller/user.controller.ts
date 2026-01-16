import { FastifyRequest, FastifyReply } from "fastify";
import UserService from "../service/User.service";

class UserController {

  // ✅ REGISTER
  async register(req: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await UserService.register(req.body);

      return reply.status(201).send({
        success: true,
        message: "User registered successfully",
        data: result,
      });
    } catch (error: any) {
      return reply.status(400).send({
        success: false,
        message: error.message,
      });
    }
  }

  // ✅ LOGIN
  async login(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { first_name, last_name, password } = req.body as any;

      const result = await UserService.login(
        first_name,
        last_name,
        password
      );

      return reply.send({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (error: any) {
      return reply.status(401).send({
        success: false,
        message: error.message,
      });
    }
  }

  // 👇 बाकी existing APIs (unchanged)
  async create(req: FastifyRequest, reply: FastifyReply) {
    const result = await UserService.create(req.body);
    return reply.status(201).send({
      success: true,
      message: "Account created successfully",
      data: result,
    });
  }

  async addMoneyByName(req: FastifyRequest, reply: FastifyReply) {
    const { first_name, last_name, add_amount } = req.body as any;
    const result = await UserService.addMoneyByName(
      first_name,
      last_name,
      add_amount
    );
    return reply.send({ success: true, data: result });
  }

async addExpense(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = req.params as { id: string };
      const { amount, category, description } = req.body as any;

      // 🔒 HARD VALIDATION & PARSING
      const parsedAmount = Number(amount);

      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return reply.status(400).send({
          success: false,
          message: "Expense amount must be greater than 0",
        });
      }

      if (!category || category.trim() === "") {
        return reply.status(400).send({
          success: false,
          message: "Category is required",
        });
      }

      // 🔁 SERVICE CALL
      const result = await UserService.addExpense(
        id,                // UUID only
        parsedAmount,      // ALWAYS number
        category,
        description
      );

      return reply.status(200).send({
        success: true,
        message: "Expense added successfully",
        data: result,
      });

    } catch (error: any) {
      return reply.status(400).send({
        success: false,
        message: error.message || "Failed to add expense",
      });
    }
  }

  async getUsers(req: FastifyRequest, reply: FastifyReply) {
    const users = await UserService.getAllUsers();
    return reply.send({ success: true, data: users });
  }

  async quickStats(req: FastifyRequest, reply: FastifyReply) {
    const stats = await UserService.quickStats();
    return reply.send({ success: true, data: stats });
  }

  async delete(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as any;
    const result = await UserService.delete(id);
    return reply.send({ success: true, data: result });
  }
}

export default new UserController();
