"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./config/db"));
const PORT = process.env.PORT || 5000;
process.on('unhandledRejection', (reason, promise) => {
    console.error('[Process] Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
    console.error('[Process] Uncaught Exception:', err);
});
(0, db_1.default)()
    .then(() => {
    const rawPort = process.env.PORT || 5000;
    const isNamedPipeOrSocket = isNaN(Number(rawPort));
    const server = isNamedPipeOrSocket
        ? app_1.default.listen(rawPort, () => {
            console.log(`[Server] Ekosmart API Server running on Passenger socket/pipe: ${rawPort}`);
        })
        : app_1.default.listen(Number(rawPort), '0.0.0.0', () => {
            console.log(`[Server] Ekosmart API Server running on port ${rawPort} (0.0.0.0)`);
        });
    const shutdown = async () => {
        console.log('[Server] Graceful shutdown initiated...');
        server.close(async () => {
            console.log('[Server] HTTP server closed.');
            process.exit(0);
        });
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
})
    .catch((err) => {
    console.error('[Server] Failed to start server:', err);
});
