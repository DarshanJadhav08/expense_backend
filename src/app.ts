import Fastify from "fastify";
import cors from "@fastify/cors";
import UserRoute from "./routes/user.route";
import sequelize from "./db/config";
import "./model/user.model";

const app = Fastify({ logger: true });

// ✅ FIXED CORS CONFIG
await app.register(cors, {
  origin: true,                 // allow all origins
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false
});

// ✅ Routes
app.register(UserRoute, { prefix: "/" });

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    await sequelize.sync();
    console.log("✅ Tables synchronized");

    await app.listen({ port: Number(process.env.PORT) || 3000, host: "0.0.0.0" });
    console.log("🚀 Server running");
  } catch (error) {
    console.error("❌ Error starting server", error);
    process.exit(1);
  }
};

start();

