"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const warranty_controller_1 = require("../controllers/warranty.controller");
const router = express_1.default.Router();
router.post('/verify-staff', warranty_controller_1.verifyWarrantyStaff);
router.post('/public/verify-staff', warranty_controller_1.verifyWarrantyStaff);
router.post('/public/register', warranty_controller_1.registerPublicWarranty);
router.post('/register', warranty_controller_1.registerPublicWarranty);
router.get('/public/check', warranty_controller_1.checkPublicWarranty);
router.get('/check', warranty_controller_1.checkPublicWarranty);
router.get('/admin', warranty_controller_1.getAdminWarranties);
router.get('/export/csv', warranty_controller_1.exportWarranties);
router.get('/export', warranty_controller_1.exportWarranties);
exports.default = router;
