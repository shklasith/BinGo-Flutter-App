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

// Serve frontend static files
const frontendPath = path.join(__dirname, '../../bingo-frontend/dist');
app.use(express.static(frontendPath));

// Mount routes
app.use('/api/scan', scanRoutes);
app.use('/api/users', userRoutes);
app.use('/api/centers', centerRoutes);
app.use('/api/education', educationRoutes);

// Basic route for health check
app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'OK', message: 'BinGo API is running' });
});

// Catch-all route for Frontend SPA
app.use((req: Request, res: Response) => {
    // Skip if it's an API call or other reserved paths
    if (req.path.startsWith('/api') || req.path.startsWith('/health') || req.path.startsWith('/uploads')) {
        return res.status(404).json({ message: 'Not Found' });
    }
    res.sendFile(path.join(frontendPath, 'index.html'));
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
