import Fastify from "fastify";
import cors from "@fastify/cors";
import sequelize from "./db/config";
import userRoutes from "./routes/user.route";

import "./model/auth-user.model";
import "./model/user.model";

const app = Fastify({ logger: true });

app.register(cors, { origin: true });

app.register(userRoutes);

const start = async () => {
  await sequelize.authenticate();
  await sequelize.sync();

  await app.listen({ port: 3000, host: "0.0.0.0" });
  console.log("🚀 Server running on http://localhost:3000");
};

start();
