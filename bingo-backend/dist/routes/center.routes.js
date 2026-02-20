"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const center_controller_1 = require("../controllers/center.controller");
const router = (0, express_1.Router)();
router.get('/nearby', center_controller_1.getNearbyCenters);
router.post('/seed', center_controller_1.seedCenters);
exports.default = router;
