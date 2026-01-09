"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const config_1 = __importDefault(require("./db/config"));
require("./model/user.model");
const app = (0, fastify_1.default)({ logger: true });
app.register(user_route_1.default, { prefix: "/" });
const start = async () => {
    try {
        // ✅ DB connect
        await config_1.default.authenticate();
        console.log("✅ Database connected");
        // ✅ AUTO CREATE TABLE
        await config_1.default.sync();
        console.log("✅ Tables synchronized");
        await app.listen({ port: 3000, host: "0.0.0.0" });
        console.log("🚀 Server running on http://localhost:3000");
    }
    catch (error) {
        console.error("❌ Error starting server", error);
        process.exit(1);
    }
};
start();
