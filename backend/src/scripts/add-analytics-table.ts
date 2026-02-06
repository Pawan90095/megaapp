import pool from '../db';

const migrate = async () => {
    const client = await pool.connect();
    try {
        console.log('Creating analytics_events table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS analytics_events (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                type VARCHAR(50) NOT NULL, -- 'view', 'download', 'share'
                meta JSONB DEFAULT '{}',
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
            CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics_events(user_id);
            CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics_events(type);
        `);
        console.log('Migration successful.');
    } catch (e) {
        console.error('Migration failed:', e);
    } finally {
        client.release();
        await pool.end();
    }
};

migrate();
