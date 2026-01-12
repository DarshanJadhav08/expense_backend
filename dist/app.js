"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const config_1 = __importDefault(require("./db/config"));
// ⚠️ Model import is required so sequelize sync works
require("./model/user.model");
require("./model/auth-user.model"); // ✅ NEW
require("./model/user.model"); // expense model (already)
const app = (0, fastify_1.default)({
    logger: true,
});
// ✅ CORS CONFIG (Fastify v5 + Render safe)
app.register(cors_1.default, {
    origin: true, // allow all origins (Render frontend)
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
});
// ✅ Routes
app.register(user_route_1.default, { prefix: "/" });
// ✅ Server start
const start = async () => {
    try {
        // DB connect
        await config_1.default.authenticate();
        console.log("✅ Database connected");
        // Auto create tables
        await config_1.default.sync({ alter: true });
        console.log("✅ Tables synchronized");
        // Listen
        await app.listen({
            port: Number(process.env.PORT) || 3000,
            host: "0.0.0.0",
        });
        console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
    }
    catch (err) {
        console.error("❌ Server error", err);
        process.exit(1);
    }
};
start();
