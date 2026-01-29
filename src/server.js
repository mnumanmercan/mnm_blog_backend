import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Routes import
import userRouter from '../routes/userRouter.js';
import postRouter from '../routes/postRouter.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares-----
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API endpoints
//-- User V1
app.use('/api/v1', userRouter);

//-- Posts V1
app.use('/api/v1', postRouter);

// Ana sayfa route
app.get('/', (req, res) => {
    res.json({
        message: 'Blog API\'ye hoş geldiniz',
        version: '1.0.0',
        endpoints: {
            users: '/api/v1/users',
            posts: '/api/v1/posts',
            categories: '/api/v1/categories'
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint bulunamadı'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Sunucu hatası',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor`);
    console.log(`API URL: http://localhost:${PORT}/api`);
});