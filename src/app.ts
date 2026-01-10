import Fastify from "fastify";
import cors from "@fastify/cors";
import UserRoute from "./routes/user.route";
import sequelize from "./db/config";

// ⚠️ Model import is required so sequelize sync works
import "./model/user.model";

const app = Fastify({
  logger: true,
});

// ✅ CORS CONFIG (Fastify v5 + Render safe)
app.register(cors, {
  origin: true, // allow all origins (Render frontend)
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

// ✅ Routes
app.register(UserRoute, { prefix: "/" });

// ✅ Server start
const start = async () => {
  try {
    // DB connect
    await sequelize.authenticate();
    console.log("✅ Database connected");

    // Auto create tables
    await sequelize.sync({ alter: true }); 
    console.log("✅ Tables synchronized");

    // Listen
    await app.listen({
      port: Number(process.env.PORT) || 3000,
      host: "0.0.0.0",
    });

    console.log(
      `🚀 Server running on port ${process.env.PORT || 3000}`
    );
  } catch (err) {
    console.error("❌ Server error", err);
    process.exit(1);
  }
};

start();
