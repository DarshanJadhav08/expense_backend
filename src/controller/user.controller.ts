import { FastifyRequest, FastifyReply } from "fastify";
import UserService from "../service/User.service";

class UserController {

  async register(req: FastifyRequest, reply: FastifyReply) {
    const data = await UserService.register(req.body);
    reply.send({ success: true, data });
  }

  async login(req: FastifyRequest, reply: FastifyReply) {
    const data = await UserService.login(req.body);
    reply.send({ success: true, data });
  }

  async addMoney(req: FastifyRequest, reply: FastifyReply) {
    const { first_name, last_name, amount, description } = req.body as any;
    const data = await UserService.addMoney(
      first_name,
      last_name,
      amount,
      description
    );
    reply.send({ success: true, data });
  }

  async addExpense(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as any;
    const { amount, category, description } = req.body as any;

    const data = await UserService.addExpense(
      Number(id),
      amount,
      category,
      description
    );
    reply.send({ success: true, data });
  }

  async quickStats(_: FastifyRequest, reply: FastifyReply) {
    const data = await UserService.quickStats();
    reply.send({ success: true, data });
  }
}

export default new UserController();
