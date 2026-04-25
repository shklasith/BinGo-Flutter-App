"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const education_controller_1 = require("../controllers/education.controller");
const router = (0, express_1.Router)();
/**
 * @openapi
 * /education/daily-tip:
 *   get:
 *     tags:
 *       - Education
 *     summary: Get a daily recycling tip
 *     description: Returns a random recycling / waste‑management tip to display in the app.
 *     security: []
 *     responses:
 *       200:
 *         description: Tip retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Tip'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/daily-tip', education_controller_1.getDailyTip);
/**
 * @openapi
 * /education/search:
 *   get:
 *     tags:
 *       - Education
 *     summary: Search the tips database
 *     description: >
 *       Performs a case‑insensitive text search across tip titles and content
 *       and returns all matching results.
 *     security: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: The search query string
 *         example: recycling
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Tip'
 *       400:
 *         description: Missing search query
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/search', education_controller_1.searchDatabase);
exports.default = router;
