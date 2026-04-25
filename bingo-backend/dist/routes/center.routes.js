"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const center_controller_1 = require("../controllers/center.controller");
const router = (0, express_1.Router)();
/**
 * @openapi
 * /centers/nearby:
 *   get:
 *     tags:
 *       - Centers
 *     summary: Get nearby recycling centers
 *     description: >
 *       Returns a list of recycling / composting centers near the provided
 *       latitude and longitude, ordered by proximity (uses MongoDB `$near`
 *       with a 2dsphere index).
 *     security: []
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *           format: float
 *         description: Latitude of the search origin
 *         example: 6.9271
 *       - in: query
 *         name: lng
 *         required: true
 *         schema:
 *           type: number
 *           format: float
 *         description: Longitude of the search origin
 *         example: 79.8612
 *       - in: query
 *         name: radius
 *         required: false
 *         schema:
 *           type: integer
 *           default: 5000
 *         description: Search radius in meters (default 5000)
 *         example: 10000
 *     responses:
 *       200:
 *         description: List of nearby centers
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Center'
 *       400:
 *         description: Missing lat or lng query params
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
router.get('/nearby', center_controller_1.getNearbyCenters);
/**
 * @openapi
 * /centers/seed:
 *   post:
 *     tags:
 *       - Centers
 *     summary: Seed dummy recycling centers
 *     description: >
 *       **Testing only.** Deletes all existing centers and inserts a set of
 *       predefined dummy recycling centers in Colombo.
 *     security: []
 *     responses:
 *       201:
 *         description: Centers seeded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Centers seeded successfully
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/seed', center_controller_1.seedCenters);
exports.default = router;
