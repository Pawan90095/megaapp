import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

import userRoutes from './routes/userRoutes';
import analyticsRoutes from './routes/analyticsRoutes';

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Professional Identity API is LIVE', version: '1.0.0' });
});

app.use('/api/users', userRoutes);
app.use('/api/analytics', analyticsRoutes);

// Dynamic QR Redirect
app.get('/q/:slug', async (req, res) => {
    const { slug } = req.params;
    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001'; // Web App Port

    try {
        // Fire and forget analytics (async)
        // 1. Get User ID
        const userRes = await pool.query('SELECT id FROM users WHERE slug = $1', [slug]);
        if (userRes.rows.length > 0) {
            const userId = userRes.rows[0].id;
            // 2. Log Scan
            await pool.query(
                'INSERT INTO analytics_events (user_id, type, meta) VALUES ($1, $2, $3)',
                [userId, 'qr_scan', JSON.stringify({ referer: req.headers['referer'] })]
            );
        }
    } catch (e) {
        // QR scan tracking failed silently - don't break redirect
    }

    // 3. Redirect (Always redirect even if tracking fails)
    res.redirect(302, `${FRONTEND_URL}/profile/${slug}`);
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        // Only log in development
        if (process.env.NODE_ENV !== 'production') {
            console.log(`Server running on port ${port}`);
        }
    });
}

export default app;
