"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const app_1 = __importDefault(require("../src/app"));
const db_1 = __importDefault(require("../src/config/db"));
async function handler(req, res) {
    try {
        // Fast warm-up for DB with 3s timeout guard so lambda never hits Vercel execution limit
        const connectPromise = (0, db_1.default)();
        const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 3000));
        await Promise.race([connectPromise, timeoutPromise]);
    }
    catch (err) {
        console.error('[Vercel Serverless] DB connection error before request:', err?.message || err);
    }
    return (0, app_1.default)(req, res);
}
