import app from './app';
import connectDB from './config/database';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB().then(() => {
    // Start Server
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
