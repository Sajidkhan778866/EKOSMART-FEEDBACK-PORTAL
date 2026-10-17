"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const router = express_1.default.Router();
router.get('/admin', dashboard_controller_1.getAdminDashboardStats);
router.get('/current-applications', dashboard_controller_1.getCurrentApplications);
router.get('/admin/current-applications', dashboard_controller_1.getCurrentApplications);
router.get('/employee/:employeeId', dashboard_controller_1.getEmployeeDashboardStats);
exports.default = router;
