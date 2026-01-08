import UserController from "../controller/user.controller";
import { FastifyInstance } from "fastify";

export default async function UserRoute(app:FastifyInstance){
  app.post("/create", UserController.create);
  app.put("/add-money/:id", UserController.add_money);
  app.put("/add-expense/:id", UserController.addExpense);
  app.delete("/delete/:id", UserController.delete);
}