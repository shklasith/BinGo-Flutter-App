"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
// Routes
const scan_routes_1 = __importDefault(require("./routes/scan.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const center_routes_1 = __importDefault(require("./routes/center.routes"));
const education_routes_1 = __importDefault(require("./routes/education.routes"));
const app = (0, express_1.default)();
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
// Static files (for uploaded images testing)
const path_1 = __importDefault(require("path"));
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
// Mount routes
app.use('/api/scan', scan_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/centers', center_routes_1.default);
app.use('/api/education', education_routes_1.default);
// Basic route for health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'BinGo API is running' });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});
exports.default = app;
