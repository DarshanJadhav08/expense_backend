import Fastify from "fastify";
import cors from "@fastify/cors";
import UserRoute from "./routes/user.route";
import sequelize from "./db/config";
import "./model/user.model";

const app = Fastify({ logger: true });

// ✅ CORRECT CORS FOR FASTIFY v5 + RENDER
app.register(cors, {
  origin: true, // allow all origins
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
});

// routes
app.register(UserRoute, { prefix: "/" });

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    await sequelize.sync();
    console.log("✅ Tables synchronized");

    await app.listen({
      port: Number(process.env.PORT) || 3000,
      host: "0.0.0.0"
    });

    console.log("🚀 Server running");
  } catch (err) {
    console.error("❌ Server error", err);
    process.exit(1);
  }
};

start();
