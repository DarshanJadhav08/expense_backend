import Fastify from "fastify";
import UserRoute from "./src/routes/user.route";
import sequelize from "./src/db/config";
import "./src/model/user.model";

const app = Fastify({ logger: true });

app.register(UserRoute, { prefix: "/" });

const start = async () => {
  try {
    // ✅ DB connect
    await sequelize.authenticate();
    console.log("✅ Database connected");

    // ✅ AUTO CREATE TABLE
    await sequelize.sync();
    console.log("✅ Tables synchronized");

    await app.listen({ port: 3000, host: "0.0.0.0" });
    console.log("🚀 Server running on http://localhost:3000");
  } catch (error) {
    console.error("❌ Error starting server", error);
    process.exit(1);
  }
};

start();
