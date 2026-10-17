"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const form_controller_1 = require("../controllers/form.controller");
const router = express_1.default.Router();
// Public routes
router.get('/public/sections', form_controller_1.getDynamicSections);
router.get('/public/complaint/:division', form_controller_1.getComplaintForm);
router.get('/public/warranty/:category', form_controller_1.getWarrantyForm);
// Admin routes
router.get('/admin/complaints', form_controller_1.getAllComplaintForms);
router.post('/admin/complaint', form_controller_1.saveComplaintForm);
router.delete('/admin/complaint/:division', form_controller_1.deleteComplaintForm);
router.get('/admin/warranties', form_controller_1.getAllWarrantyForms);
router.post('/admin/warranty', form_controller_1.saveWarrantyForm);
router.delete('/admin/warranty/:category', form_controller_1.deleteWarrantyForm);
exports.default = router;
