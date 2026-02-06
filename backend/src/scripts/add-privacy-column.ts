import pool from '../db';

const migrate = async () => {
    const client = await pool.connect();
    try {
        console.log('Adding privacy_settings column...');
        await client.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS privacy_settings JSONB DEFAULT '{}'
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
