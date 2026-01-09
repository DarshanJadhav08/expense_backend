"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const config_1 = __importDefault(require("./db/config"));
require("./model/user.model");
const app = (0, fastify_1.default)({ logger: true });
// ✅ CORRECT CORS FOR FASTIFY v5 + RENDER
app.register(cors_1.default, {
    origin: true, // allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
});
// routes
app.register(user_route_1.default, { prefix: "/" });
const start = async () => {
    try {
        await config_1.default.authenticate();
        console.log("✅ Database connected");
        await config_1.default.sync();
        console.log("✅ Tables synchronized");
        await app.listen({
            port: Number(process.env.PORT) || 3000,
            host: "0.0.0.0"
        });
        console.log("🚀 Server running");
    }
    catch (err) {
        console.error("❌ Server error", err);
        process.exit(1);
    }
};
start();
