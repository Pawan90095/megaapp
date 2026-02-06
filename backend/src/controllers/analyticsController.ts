import { Request, Response } from 'express';
import pool from '../db';

export const trackEvent = async (req: Request, res: Response) => {
    const { slug, type, meta } = req.body;
    try {
        // Need user_id from slug
        const userRes = await pool.query('SELECT id FROM users WHERE slug = $1', [slug]);
        if (userRes.rows.length === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const userId = userRes.rows[0].id;

        await pool.query(
            'INSERT INTO analytics_events (user_id, type, meta) VALUES ($1, $2, $3)',
            [userId, type, meta]
        );
        res.sendStatus(201);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getStats = async (req: Request, res: Response) => {
    const { slug } = req.params;
    try {
        const userRes = await pool.query('SELECT id FROM users WHERE slug = $1', [slug]);
        if (userRes.rows.length === 0) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const userId = userRes.rows[0].id;

        // Aggregate stats
        const statsRes = await pool.query(
            `SELECT type, COUNT(*) as count 
             FROM analytics_events 
             WHERE user_id = $1 
             GROUP BY type`,
            [userId]
        );

        const stats: Record<string, number> = {};
        statsRes.rows.forEach(row => {
            stats[row.type] = parseInt(row.count, 10);
        });

        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
