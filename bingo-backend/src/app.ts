import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Routes
import scanRoutes from './routes/scan.routes';
import userRoutes from './routes/user.routes';
import centerRoutes from './routes/center.routes';
import educationRoutes from './routes/education.routes';

const app: Express = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Static files (for uploaded images testing)
import path from 'path';
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Mount routes
app.use('/api/scan', scanRoutes);
app.use('/api/users', userRoutes);
app.use('/api/centers', centerRoutes);
app.use('/api/education', educationRoutes);

// Basic route for health check
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        data: { status: 'OK' },
        message: 'BinGo API is running'
    });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

export default app;
