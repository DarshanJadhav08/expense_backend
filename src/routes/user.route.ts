import UserController from "../controller/user.controller";

export default async function userRoutes(app: any) {
  app.post("/user", UserController.create);
  app.get("/users", UserController.getUsers);
  app.post("/add-money-by-name", UserController.addMoneyByName);
  app.post("/user/:id/expense", UserController.addExpense);
  app.get("/quick-stats", UserController.quickStats);
  app.delete("/user/:id", UserController.delete);

  app.post("/register", UserController.register);
  app.post("/login", UserController.login);
}
