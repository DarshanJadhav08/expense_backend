import UserController from "../controller/user.controller";

export default async function userRoutes(app: any) {
  app.post("/register", UserController.register);
  app.post("/login", UserController.login);

  app.post("/add-money", UserController.addMoney);
  app.post("/user/:id/expense", UserController.addExpense);

  app.get("/quick-stats", UserController.quickStats);

  app.get("/report/generate", UserController.generateReport);
  app.get("/report/download", UserController.downloadReport);
}
