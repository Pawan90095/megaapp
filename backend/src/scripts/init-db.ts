import fs from 'fs';
import path from 'path';
import pool from '../db';

const runMigrations = async () => {
    const client = await pool.connect();
    try {
        console.log('Running migrations...');
        const schemaPath = path.join(__dirname, '../db/schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        await client.query('BEGIN');
        await client.query(schemaSql);
        await client.query('COMMIT');

        console.log('Migrations completed successfully.');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Migration failed:', error);
        process.exit(1);
    } finally {
        client.release();
        await pool.end();
    }
};

runMigrations();
