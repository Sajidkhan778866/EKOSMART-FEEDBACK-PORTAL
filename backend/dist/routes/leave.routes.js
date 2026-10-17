"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const leave_controller_1 = require("../controllers/leave.controller");
const router = express_1.default.Router();
// Preview calculation without saving
router.post('/calculate', leave_controller_1.previewLeaveDuration);
// Employee actions
router.post('/apply', leave_controller_1.applyLeave);
router.get('/my', leave_controller_1.getMyLeaves);
// Admin actions
router.get('/', leave_controller_1.getAdminLeaves);
router.patch('/:id/status', leave_controller_1.updateLeaveStatus);
router.put('/:id/status', leave_controller_1.updateLeaveStatus);
exports.default = router;
