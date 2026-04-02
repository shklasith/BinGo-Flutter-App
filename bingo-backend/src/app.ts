import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import scanRoutes from "./routes/scan.routes";
import userRoutes from "./routes/user.routes";
import centerRoutes from "./routes/center.routes";
import educationRoutes from "./routes/education.routes";

const app: Express = express();

const swaggerOptions: swaggerJsdoc.Options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "BinGo API",
			version: "1.0.0",
			description: "API documentation for the BinGo application",
		},
		servers: [
			{
				url: "/api",
				description: "API base path",
			},
		],
		tags: [
			{ name: "System", description: "Health & status endpoints" },
			{ name: "Users", description: "Authentication and user management" },
			{ name: "Scan", description: "Waste image scanning & classification" },
			{ name: "Centers", description: "Recycling center lookup" },
			{ name: "Education", description: "Tips and educational content" },
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
				},
			},
			schemas: {
				ErrorResponse: {
					type: "object",
					properties: {
						success: { type: "boolean", example: false },
						message: { type: "string", example: "An error occurred" },
					},
				},
				ImpactStats: {
					type: "object",
					properties: {
						treesSaved: { type: "number", example: 0 },
						plasticDiverted: { type: "number", example: 3 },
						co2Reduced: { type: "number", example: 1.5 },
					},
				},
				User: {
					type: "object",
					properties: {
						_id: { type: "string", example: "664a1f..." },
						username: { type: "string", example: "greenHero" },
						email: {
							type: "string",
							format: "email",
							example: "hero@example.com",
						},
						points: { type: "number", example: 120 },
						badges: {
							type: "array",
							items: { type: "string" },
							example: ["first_scan"],
						},
						impactStats: { $ref: "#/components/schemas/ImpactStats" },
						createdAt: { type: "string", format: "date-time" },
						updatedAt: { type: "string", format: "date-time" },
					},
				},
				ClassificationResult: {
					type: "object",
					properties: {
						itemName: { type: "string", example: "Plastic bottle" },
						isWaste: { type: "boolean", example: true },
						category: {
							type: "string",
							enum: [
								"Recyclable",
								"Compost",
								"E-Waste",
								"Landfill",
								"Special",
								"Unknown",
							],
							example: "Recyclable",
						},
						prepSteps: {
							type: "array",
							items: { type: "string" },
							example: ["Remove cap", "Rinse container", "Place in blue bin"],
						},
						confidence: {
							type: "number",
							format: "float",
							example: 0.92,
						},
					},
				},
				ScanHistory: {
					type: "object",
					properties: {
						_id: { type: "string", example: "664b2a..." },
						userId: { type: "string", example: "664a1f..." },
						imageUrl: {
							type: "string",
							example: "local/1717000000000-123456789.jpg",
						},
						classificationResult: {
							$ref: "#/components/schemas/ClassificationResult",
						},
						location: {
							type: "object",
							properties: {
								lat: { type: "number", example: 6.9271 },
								lng: { type: "number", example: 79.8612 },
							},
						},
						pointsEarned: { type: "number", example: 10 },
						createdAt: { type: "string", format: "date-time" },
					},
				},
				Center: {
					type: "object",
					properties: {
						_id: { type: "string", example: "664c3b..." },
						name: { type: "string", example: "Colombo Recycling Hub" },
						address: {
							type: "string",
							example: "123 Main St, Colombo",
						},
						location: {
							type: "object",
							properties: {
								type: { type: "string", example: "Point" },
								coordinates: {
									type: "array",
									items: { type: "number" },
									example: [79.8612, 6.9271],
									description: "[longitude, latitude]",
								},
							},
						},
						acceptedMaterials: {
							type: "array",
							items: { type: "string" },
							example: ["Recyclable", "E-Waste"],
						},
						operatingHours: {
							type: "string",
							example: "9 AM - 5 PM",
						},
						contactNumber: {
							type: "string",
							example: "0112345678",
						},
					},
				},
				Tip: {
					type: "object",
					properties: {
						title: {
							type: "string",
							example: "Rinse before recycling",
						},
						content: {
							type: "string",
							example:
								"Always rinse your plastic containers. Food residue can contaminate an entire batch of recyclables.",
						},
					},
				},
			},
		},
		security: [{ bearerAuth: [] }],
	},
	apis: ["./src/routes/*.ts", "./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/docs", (req: Request, res: Response, next: NextFunction) => {
	res.setHeader("Content-Security-Policy", "");
	next();
});

app.use(
	"/api/docs",
	swaggerUi.serve,
	swaggerUi.setup(swaggerSpec, {
		explorer: true,
		customSiteTitle: "BinGo API Docs",
	}),
);

app.get("/api/docs.json", (req: Request, res: Response) => {
	res.setHeader("Content-Type", "application/json");
	res.send(swaggerSpec);
});

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const frontendPath = path.join(__dirname, "../../bingo-frontend/dist");
app.use(express.static(frontendPath));

app.use("/api/scan", scanRoutes);
app.use("/api/users", userRoutes);
app.use("/api/centers", centerRoutes);
app.use("/api/education", educationRoutes);

app.use((req: Request, res: Response) => {
	if (
		req.path.startsWith("/api") ||
		req.path.startsWith("/health") ||
		req.path.startsWith("/uploads")
	) {
		return res.status(404).json({ message: "Not Found" });
	}
	res.sendFile(path.join(frontendPath, "index.html"));
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
	console.error(err.stack);
	res.status(500).json({
		success: false,
		message: err.message || "Internal Server Error",
	});
});

export default app;
