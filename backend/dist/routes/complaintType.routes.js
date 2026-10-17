"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const complaintType_controller_1 = require("../controllers/complaintType.controller");
const router = express_1.default.Router();
router.get('/', complaintType_controller_1.getComplaintTypes);
router.post('/', complaintType_controller_1.createComplaintType);
router.put('/:id', complaintType_controller_1.updateComplaintType);
router.patch('/:id', complaintType_controller_1.updateComplaintType);
router.delete('/:id', complaintType_controller_1.deleteComplaintType);
exports.default = router;
