"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const config_1 = __importDefault(require("./db/config"));
const user_route_1 = __importDefault(require("./routes/user.route"));
require("./model/auth-user.model");
require("./model/user.model");
const app = (0, fastify_1.default)({ logger: true });
app.register(cors_1.default, { origin: true });
app.register(user_route_1.default);
const start = async () => {
    await config_1.default.authenticate();
    await config_1.default.sync({ alter: true });
    await app.listen({ port: 3000, host: "0.0.0.0" });
    console.log("🚀 Server running on http://localhost:3000");
};
start();
