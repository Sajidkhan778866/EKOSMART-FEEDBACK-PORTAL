"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const complaint_controller_1 = require("../controllers/complaint.controller");
const router = express_1.default.Router();
// Public routes
router.post('/public', complaint_controller_1.submitPublicComplaint);
router.get('/public/track/:ticketNumber', complaint_controller_1.trackPublicComplaint);
// Admin / Employee routes
router.get('/', complaint_controller_1.getAdminComplaints);
router.get('/admin', complaint_controller_1.getAdminComplaints);
router.get('/export', complaint_controller_1.exportComplaints);
router.get('/ticket/:ticketNumber', complaint_controller_1.getComplaintById);
router.get('/admin/:id', complaint_controller_1.getComplaintById);
router.get('/:id', complaint_controller_1.getComplaintById);
router.post('/admin/:id/assign', complaint_controller_1.assignComplaint);
router.patch('/admin/:id/status', complaint_controller_1.updateComplaintStatus);
router.put('/admin/:id/status', complaint_controller_1.updateComplaintStatus);
exports.default = router;
