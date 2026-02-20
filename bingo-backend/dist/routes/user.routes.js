"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
router.post('/register', user_controller_1.registerUser);
router.get('/leaderboard', user_controller_1.getLeaderboard);
router.get('/:id', user_controller_1.getProfile);
exports.default = router;
