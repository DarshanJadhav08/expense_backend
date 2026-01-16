import { FastifyRequest, FastifyReply } from "fastify";
import UserService from "../service/User.service";

class UserController {

  register = async (req: FastifyRequest, reply: FastifyReply) =>
    reply.send(await UserService.register(req.body));

  login = async (req: FastifyRequest, reply: FastifyReply) =>
    reply.send(await UserService.login(
      (req.body as any).first_name,
      (req.body as any).last_name,
      (req.body as any).password
    ));

  create = async (req: FastifyRequest, reply: FastifyReply) =>
    reply.send(await UserService.create(req.body));

  addMoneyByName = async (req: FastifyRequest, reply: FastifyReply) =>
    reply.send(await UserService.addMoneyByName(
      (req.body as any).first_name,
      (req.body as any).last_name,
      (req.body as any).add_amount
    ));

  addExpense = async (req: FastifyRequest, reply: FastifyReply) =>
    reply.send(await UserService.addExpense(
      Number((req.params as any).id),
      (req.body as any).expense,
      (req.body as any).category,
      (req.body as any).description
    ));

  getUsers = async (_: any, reply: FastifyReply) =>
    reply.send(await UserService.getAllUsers());

  quickStats = async (_: any, reply: FastifyReply) =>
    reply.send(await UserService.quickStats());

  delete = async (req: any, reply: any) =>
    reply.send(await UserService.delete(Number(req.params.id)));
}

export default new UserController();
