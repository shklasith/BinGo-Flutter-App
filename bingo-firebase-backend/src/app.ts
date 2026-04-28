import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import centerRoutes from './routes/center.routes';
import educationRoutes from './routes/education.routes';
import scanRoutes from './routes/scan.routes';
import userRoutes from './routes/user.routes';

const app: Express = express();

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'BinGo Firebase Backend API',
      version: '1.0.0',
      description: 'Firebase Auth, Firestore, Storage, Gemini, and Cloud Run backend for BinGo.',
    },
    servers: [{ url: '/api', description: 'API base path' }],
    tags: [
      { name: 'System', description: 'Health endpoints' },
      { name: 'Users', description: 'Firebase user profile, settings, and leaderboard' },
      { name: 'Scan', description: 'Waste image scanning and classification' },
      { name: 'Centers', description: 'Recycling center lookup' },
      { name: 'Education', description: 'Tips and educational content' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'Firebase ID token',
        },
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'An error occurred' },
          },
        },
        ClassificationResult: {
          type: 'object',
          properties: {
            itemName: { type: 'string', example: 'Plastic bottle' },
            isWaste: { type: 'boolean', example: true },
            category: {
              type: 'string',
              enum: ['Recyclable', 'Compost', 'E-Waste', 'Landfill', 'Special', 'Unknown'],
              example: 'Recyclable',
            },
            prepSteps: {
              type: 'array',
              items: { type: 'string' },
              example: ['Remove cap', 'Rinse container', 'Place in recycling bin'],
            },
            confidence: { type: 'number', example: 0.92 },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './dist/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const corsOrigin = process.env.CORS_ORIGIN ?? '*';

app.use(helmet());
app.use(
  cors({
    origin: corsOrigin === '*' ? true : corsOrigin.split(',').map((origin) => origin.trim()),
  }),
);
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ success: true, status: 'ok' });
});

app.use('/api/docs', (_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Content-Security-Policy', '');
  next();
});
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true, customSiteTitle: 'BinGo Firebase API Docs' }));
app.get('/api/docs.json', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/api/scan', scanRoutes);
app.use('/api/users', userRoutes);
app.use('/api/centers', centerRoutes);
app.use('/api/education', educationRoutes);

app.use((req: Request, res: Response) => {
  return res.status(404).json({ success: false, message: req.path.startsWith('/api') ? 'Not Found' : 'Backend API only' });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  return res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

export default app;
