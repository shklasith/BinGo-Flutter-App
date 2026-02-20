"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const education_controller_1 = require("../controllers/education.controller");
const router = (0, express_1.Router)();
router.get('/daily-tip', education_controller_1.getDailyTip);
router.get('/search', education_controller_1.searchDatabase);
exports.default = router;
